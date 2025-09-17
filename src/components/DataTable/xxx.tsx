import { clamp, difference, isEqual, mapValues, omit, sumBy } from 'es-toolkit'
import { createContext, createMemo, createSignal, For, useContext, type JSXElement, createEffect, type JSX, type Component, createComputed, onMount, mergeProps, mapArray, onCleanup, children } from 'solid-js'
import { createMutable } from 'solid-js/store'
import { Dynamic, memo, Portal } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import { toReactive, useMemo, usePointerDrag } from '../../hooks'
import { useSplit } from '../Split'

import './DataTable.scss'
import { log, unFn } from '../../utils'
import { createLazyMemo } from '@solid-primitives/memo'
import { createElementSize } from '@solid-primitives/resize-observer'
import { CellSelectionPlugin } from './plugins/CellSelectionPlugin'
import { CopyPlugin, PastePlugin } from './plugins/CopyPastePlugin'
import { VirtualScrollPlugin } from './plugins/VirtualScrollPlugin'
import { ExpandPlugin } from './plugins/ExpandPlugin'
import { component } from 'undestructure-macros'
import { RowGroupPlugin } from './plugins/RowGroupPlugin'
import { EditablePlugin } from './plugins/EditablePlugin'

export const Ctx = createContext({
  props: {} as TableProps
})

type ProcessProps = {
  [K in keyof TableProps]?: (props: TableProps, ctx: { store: TableStore }) => TableProps[K]
}

export type Plugin = {
  store?: (store: TableStore) => Partial<TableStore>
  processProps?: ProcessProps
}

export interface TableProps {
  columns?: TableColumn[]
  data?: any[]
  index?: boolean
  border?: boolean
  stickyHeader?: boolean
  class: any
  style: any
  // Component
  td?: string | Component<{ x: number; y: number; data: any; col: TableColumn; children: JSX.Element }>
  th?: string | Component<{ x: number; col: TableColumn; children: JSX.Element }>
  tr?: string | Component<{ y?: number; data?: any; children: JSX.Element }>
  thead?: string | Component<any>
  tbody?: string | Component<any>
  table?: string | Component<any>
  EachRows?: typeof For
  EachCells?: typeof For
  // 
  thProps?: (props) => JSX.HTMLAttributes<any> | void
  tdProps?: (props) => JSX.HTMLAttributes<any> | void
  cellProps?: (props) => JSX.HTMLAttributes<any> | void
  // Plugin
  plugins?: Plugin[]
}

type Obj = Record<string | symbol, any>

export interface TableColumn extends Obj {
  id?: any
  name?: string
  width?: number
  fixed?: 'left' | 'right'
  render?: (data: any, index: number) => JSXElement
  class?: any
  style?: any
  props?: (props) => JSX.HTMLAttributes<any>
  onWidthChange?: (width: number) => void
}

type Nullable<T> = T | undefined

export interface TableStore extends Obj {
  ths: Nullable<Element>[]
  thSizes: Nullable<{ width: number; height: number }>[]
  trs: Nullable<Element>[]
  trSizes: Nullable<{ width: number; height: number }>[]
  internal: symbol
  props?: TableProps
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
  
  const store = createMutable({}) as TableStore
  const mProps = toReactive(() => pluginsProps()[pluginsProps().length - 1][0]()) as TableProps
  store.props = mProps

  createComputed((old: Plugin[]) => {
    const added = difference(plugins(), old)
    added.forEach(e => Object.assign(store, e.store?.(store)))
    return plugins()
  }, [])

  const ctx = createMutable({ x: 0, props: mProps })

  window.store = store
  window.ctx = ctx

  // createEffect(() => {
  //   console.log(JSON.parse(JSON.stringify(ctx.props.data)))
  // })

  return (
    <Ctx.Provider value={ctx}>
      <Dynamic component={ctx.props.table || 'table'}>
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
        <Dynamic component={props.tr || 'tr'} y={rowIndex()} data={row}>
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
  // ExpandPlugin(),
  // RowGroupPlugin(),
  EditablePlugin()
]

function BasePlugin(): Plugin {
  const omits = { col: null, data: null }
  return {
    store: (store) => ({
      ths: [],
      thSizes: toReactive(mapArray(() => store.ths, el => el && createElementSize(el))),
      trs: [],
      trSizes: toReactive(mapArray(() => store.trs, el => el && createElementSize(el))),
      // 
      internal: Symbol('internal_col')
    }),
    processProps: {
      tbody: ({ tbody }) => tbody || 'tbody',
      thead: ({ thead }) => thead || 'thead',
      table: ({ table }) => o => {
        const { props } = useContext(Ctx)
        o = combineProps(() => ({
          class: `data-table ${props.class} ${props.border && 'data-table--border'}`,
          style: props.style
        }), o)
        return (
          <Dynamic component={table || 'table'} {...o} />
        )
      },
      tr: ({ tr }, { store }) => component(({ data, ...o }) => {
        const [el, setEl] = createSignal<HTMLElement>()
        o = combineProps({ ref: setEl }, o)

        createEffect(() => {
          const { y } = o
          store.trs[y] = el()
          onCleanup(() => store.trs[y] = void 0)
        })

        return <Dynamic component={tr || 'tr'} {...o} />
      }),
      th: ({ th }, { store }) => o => {
        const [el, setEl] = createSignal<HTMLElement>()
        
        const { props } = useContext(Ctx)
        const mProps = combineProps(
          o,
          () => ({ ref: setEl, class: o.col.class, style: o.col.style }),
          createMemo(() => props.cellProps?.(o) || {}, null, { equals: isEqual }),
          createMemo(() => props.thProps?.(o) || {}, null, { equals: isEqual }),
          createMemo(() => o.col.props?.(o) || {}, null, { equals: isEqual }),
          omits
        )

        createEffect(() => {
          const { x } = o
          store.ths[x] = el()
          onCleanup(() => store.ths[x] = void 0)
        })
        
        return <Dynamic component={th || 'th'} {...mProps}>{o.children}</Dynamic>
      },
      td: ({ td }, { store }) => o => {
        const { props } = useContext(Ctx)
        const mProps = combineProps(
          o,
          () => ({ class: o.col.class, style: o.col.style }),
          createMemo(() => props.cellProps?.(o) || {}, null, { equals: isEqual }),
          createMemo(() => props.tdProps?.(o) || {}, null, { equals: isEqual }),
          createMemo(() => o.col.props?.(o) || {}, null, { equals: isEqual }),
          omits
        )
        return <Dynamic component={td || 'td'} {...mProps}>{o.children}</Dynamic>
      },
      EachRows: ({ EachRows }) => EachRows || For,
      EachCells: ({ EachCells }) => EachCells || For
    }
  }
}

function IndexPlugin(): Plugin {
  return {
    store: (store) => ({
      $index: { name: '', id: Symbol('index'), fixed: 'left', [store.internal]: 1, width: 40, style: 'text-align: center', class: 'index', render: (_, i) => i + 1 }
    }),
    processProps: {
      columns: (props, { store }) => props.index ? [store.$index, ...props.columns || []] : props.columns
    }
  }
}

function StickyHeaderPlugin(): Plugin {
  return {
    processProps: {
      thead: ({ thead }) => o => {
        const { props } = useContext(Ctx)
        o = combineProps(() => props.stickyHeader ? { class: 'sticky-header' } : {}, o)
        return <Dynamic component={thead} {...o} />
      },
    }
  }
}

function FixedColumnPlugin(): Plugin {
  return {
    processProps: {
      columns: ({ columns }) => [
        ...columns?.filter(e => e.fixed == 'left') || [],
        ...columns?.filter(e => !e.fixed) || [],
        ...columns?.filter(e => e.fixed == 'right') || [],
      ],
      cellProps: ({ cellProps }, { store }) => (o) => {
        const { x, col: { fixed } } = o
        const prev = cellProps?.(o)
        return fixed ? combineProps(prev || {}, {
          class: `fixed-${fixed}`,
          style: `${fixed}: ${sumBy(store.thSizes.slice(fixed == 'left' ? 0 : x + 1, fixed == 'left' ? x : Infinity), size => size?.width || 0)}px`
        }) : prev
      }
    }
  }
}

function ResizePlugin(): Plugin {
  return {
    processProps: {
      thead: ({ thead }, { store }) => (o) => {
        let theadEl: HTMLElement

        const { props } = useContext(Ctx)

        onMount(() => {
          useSplit({ container: theadEl, cells: () => store.ths, size: 8, handle: i => <Handle i={i} /> })
        })

        const Handle: Component = ({ i }) => {
          let el!: HTMLElement
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

        o = combineProps({ ref: e => theadEl = e }, o)
        return <Dynamic component={thead} {...o} />
      },
    }
  }
}