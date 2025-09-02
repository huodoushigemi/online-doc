import { clamp, difference, flow, inRange, isEqual, mapValues, merge, omit } from 'es-toolkit'
import { createContext, createMemo, createSignal, For, useContext, type JSXElement, splitProps, createEffect, type JSX, type Component, createComputed, onMount, mergeProps, untrack, batch, mapArray, getOwner, $PROXY } from 'solid-js'
import { createMutable } from 'solid-js/store'
import { Dynamic, memo, Portal } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import { toReactive, useClicked, useMemo, useMutation, usePointerDrag, useSignle2 } from '../../hooks'
import { Split, useSplit } from '../Split'

import './DataTable.scss'
import { log, unFn } from '../../utils'
import { createLazyMemo } from '@solid-primitives/memo'
import { CellSelectionPlugin } from './plugins/CellSelectionPlugin'
import { CopyPlugin, PastePlugin } from './plugins/CopyPastePlugin'
import { VirtualScrollPlugin } from './plugins/VirtualScrollPlugin'

export const Ctx = createContext({
  x: 0,
  props: {} as TableProps
})

type ProcessProps = {
  [K in keyof TableProps]?: (props: TableProps, ctx: { store: Record<string, any> }) => TableProps[K]
}

export type Plugin = {
  store?: () => Record<string, any>
  processProps?: ProcessProps
}

interface TableProps {
  columns?: TableColumn[]
  data?: any[]
  index?: boolean
  stickyHeader?: boolean
  // Component
  td?: string | Component<any>
  th?: string | Component<any>
  tr?: string | Component<any>
  thead?: string | Component<any>
  tbody?: string | Component<any>
  table?: string | Component<any>
  EachRows?: typeof For
  EachCells?: typeof For
  // 
  thProps?: (props) => JSX.HTMLAttributes<any>
  tdProps?: (props) => JSX.HTMLAttributes<any>
  // Plugin
  plugins?: Plugin[]
}

interface TableColumn {
  id?: any
  name: string
  width?: number
  fixed?: 'left' | 'right'
  render?: (data: any, index: number) => JSXElement
  class?: any
  style?: any
  props?: (props) => JSX.HTMLAttributes<any>
  onWidthChange?: (width: number) => void
}

export const Table = (props: TableProps) => {
  const plugins = createMemo(() => [...defaultsPlugins, ...props.plugins || []])

  const pluginsProps = mapArray(plugins, () => createSignal<Partial<TableProps>>({}))
  
  createEffect(mapArray(plugins, (e, i) => {
    // const prev = toReactive(createMemo(() => pluginsProps()[i() - 1]?.[0]() || props))
    const prev = createMemo(() => pluginsProps()[i() - 1]?.[0]() || props)

    const ret = toReactive(mergeProps(prev(), mapValues(e.processProps || {}, v => useMemo(() => v(prev(), { store })) )))

    pluginsProps()[i()][1](ret)
  }))

  mapArray(createMemo(() => Object.keys(props)), k => {
    plugins().reduce((o, e, i) => {}, props[k])
  })
  
  const store = createMutable({})

  createComputed((old: Plugin[]) => {
    const added = difference(plugins(), old)
    added.forEach(e => Object.assign(store, e.store?.()))
    return plugins()
  }, [])

  const ctx = createMutable({ x: 0, props: toReactive(() => pluginsProps()[pluginsProps().length - 1][0]()) })

  createEffect(() => {
    console.log(JSON.parse(JSON.stringify(ctx.props.data)))
  })

  return (
    <Ctx.Provider value={ctx}>
      <Dynamic component={ctx.props.table || 'table'} class='m-2 data-table'>
        <colgroup>
          <For each={ctx.props.columns}>{e => <col style={`width: ${e.width}px`} />}</For>
        </colgroup>
        <THead />
        <TBody />
      </Dynamic>
    </Ctx.Provider>
  )
}

const THead = () => {
  const { props } = useContext(Ctx)
  return (
    <Dynamic component={props.thead || 'thead'}>
      <Dynamic component={props.tr || 'tr'}>
        <Dynamic component={props.EachCells || For} each={props.columns || []}>
          {(col, colIndex) => <Dynamic component={props.th || 'th'} col={col} x={colIndex()}>{col.name}</Dynamic>}
        </Dynamic>
      </Dynamic>
    </Dynamic>
  )
}

const TBody = () => {
  const { props } = useContext(Ctx)
  return (
    <Dynamic component={props.tbody || 'tbody'}>
      <Dynamic component={props.EachRows || For} each={props.data}>{(row, rowIndex) => (
        <Dynamic component={props.tr || 'tr'}>
          <Dynamic component={props.EachCells || For} each={props.columns}>{(col, colIndex) => (
            <Dynamic component={props.td || 'td'} col={col} x={colIndex()} y={rowIndex()} data={row}>
              {col.render ? col.render(row, rowIndex()) : row[col.id]}
            </Dynamic>
          )}</Dynamic>
        </Dynamic>
      )}</Dynamic>
    </Dynamic>
  )
}

// process ===================================================================================================================================================================================================

export const defaultsPlugins = [
  BasePlugin(),
  IndexPlugin(),
  StickyHeaderPlugin(),
  FixedColumnPlugin(),
  ResizePlugin(),
  CellSelectionPlugin(),
  CopyPlugin(),
  PastePlugin(),
  VirtualScrollPlugin(),
]

function BasePlugin(): Plugin {
  const ks = ['col', 'data']
  return {
    processProps: {
      tr: ({ tr }) => tr || 'tr',
      tbody: ({ tbody }) => tbody || 'tbody',
      thead: ({ thead }) => thead || 'thead',
      table: ({ table }) => table || 'table',
      th: ({ th }) => o => {
        const { props } = useContext(Ctx)
        const mProps = combineProps(
          o,
          () => ({ class: o.col.class, style: o.col.style }),
          createMemo(() => o.col.props?.(o) || {}, null, { equals: isEqual }),
          createMemo(() => props.thProps?.(o) || {}, null, { equals: isEqual }),
        )
        return <Dynamic component={th || 'th'} {...omit(mProps, ks)} />
      },
      td: ({ td }) => o => {
        const { props } = useContext(Ctx)
        const mProps = combineProps(
          o,
          () => ({ class: o.col.class, style: o.col.style }),
          createMemo(() => o.col.props?.(o) || {}, null, { equals: isEqual }),
          createMemo(() => props.tdProps?.(o) || {}, null, { equals: isEqual }),
        )
        return <Dynamic component={td || 'td'} {...omit(mProps, ks)} />
      },
      EachRows: ({ EachRows }) => EachRows || For,
      EachCells: ({ EachCells }) => EachCells || For
    }
  }
}

function IndexPlugin(): Plugin {
  return {
    store: () => ({
      $index: { name: '', id: Symbol('index'), fixed: 'left', style: 'text-align: center', class: 'index', render: (_, i) => i + 1 }
    }),
    processProps: {
      columns: (props, { store }) => props.index ? [store.$index, ...props.columns || []] : props.columns
    }
  }
}

function StickyHeaderPlugin(): Plugin {
  return {
    processProps: {
      thead: (props) => o => {
        const [_, o2] = splitProps(o, ['children'])
        return (
          <Dynamic
            component={props.thead}
            {...combineProps(o2, props.stickyHeader ? { style: 'position: sticky; top: 0; background: #fff; z-index: 1; box-shadow: 0 1px 4px rgba(0,0,0,.2);' } : {})}
          >
            {o.children}
          </Dynamic>
        )
      },
    }
  }
}

function FixedColumnPlugin(): Plugin {
  return {
    processProps: {
      columns: ({ columns }) => [
        ...columns?.filter(e => e.fixed == 'left').map(col => ({
          ...col,
          props(o) {
            return combineProps(col.props ? col.props(...arguments) : o, { class: `fixed-${o.col.fixed}`, style: `${o.col.fixed}: 0` })
          }
        })) || [],
        ...columns?.filter(e => !e.fixed) || [],
        ...columns?.filter(e => e.fixed == 'right').map(col => ({
          ...col,
          props(o) {
            return combineProps(col.props ? col.props(...arguments) : o, { class: `fixed-${o.col.fixed}`, style: `right: 0` })
          }
        })) || [],
      ],
    }
  }
}

function ResizePlugin(): Plugin {
  return {
    processProps: {
      thead: ({ thead }) => (o) => {
        const [_, o2] = splitProps(o, ['children'])
        let theadEl: HTMLElement

        const { props } = useContext(Ctx)

        onMount(() => {
          const ths = useMutation(() => theadEl, { subtree: true, childList: true }, () => [...theadEl.querySelector('tr')?.children!])
          useSplit({ container: theadEl, cells: ths, size: 8, handle: i => <Handle i={i} /> })
        })

        const Handle: Component = ({ i }) => {
          let el: HTMLElement
          usePointerDrag(() => el, {
            start(e, move, end) {
              const col = theadEl.parentElement?.querySelector('colgroup')?.children[i - 1]! as HTMLTableColElement
              const sw = col.offsetWidth
              move((e, o) => col.style.width = `${clamp(sw + o.ox, 45, 800)}px`)
              // end(() => props.columns[o.i - 1].width = col.offsetWidth) // todo
              end(() => props.columns![i - 1].onWidthChange?.(col.offsetWidth))
            },
          })
          return <div ref={el} class="handle size-full cursor-w-resize hover:bg-gray active:bg-gray" />
        }

        return (
          <Dynamic
            component={thead}
            {...combineProps(o2, { ref: e => theadEl = e })}
          >
            {o.children}
          </Dynamic>
        )
      },
    }
  }
}