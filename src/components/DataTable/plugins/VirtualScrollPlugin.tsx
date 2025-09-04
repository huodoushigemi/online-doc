import { createMemo, onMount, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import { createVirtualizer, defaultRangeExtractor } from '@tanstack/solid-virtual'
import { Ctx, type Plugin } from '../xxx'
import { log } from '../../../utils'
import { keyBy } from 'es-toolkit'

const $ML = Symbol()

// const aa: TableProps
declare module '../xxx' {
  interface TableProps {
    
  }
}

export function VirtualScrollPlugin(): Plugin {
  return {
    processProps: {
      table: ({ table }, { store }) => (o) => {
        let el: HTMLElement

        const { props } = useContext(Ctx)
        
        const virtualizerY = createVirtualizer({
          getScrollElement: () => el,
          count: props.data?.length || 0,
          estimateSize: () => 30,
          overscan: 10,
          indexAttribute: 'y',
          // rangeExtractor(range) {
          //   return range
          // }
        })

        const virtualizerX = createVirtualizer({
          horizontal: true,
          getScrollElement: () => el,
          count: props.columns?.length || 0,
          estimateSize: i => props.columns?.[i].width ?? 40,
          overscan: 5,
          indexAttribute: 'x',
          rangeExtractor(range) {
            return [
              ...new Set([...props.columns?.map((e, i) => e.fixed ? i : void 0).filter(e => e != null) || [],
              ...defaultRangeExtractor(range)])
            ]
          }
        })

        store.virtualizerY = virtualizerY
        store.virtualizerX = virtualizerX

        store[$ML] ??= createMemo(() => {
          const items = store.virtualizerX.getVirtualItems()
          const ret = {}
          for (let i = 1; i < items.length; i++) {
            const item = items[i], prev = items[i - 1]
            if (item.index - prev.index > 1) ret[item.index] = { item, offset: item.start - prev.end }
          }
          return ret
        })

        o = combineProps(() => ({ ref: e => el = e, class: 'virtual', style: `width: 600px; height: 600px; overflow: auto;` }), o)

        return (
          <Dynamic component={table} {...o}>
            {o.children}
            <div style={`position: absolute; top: 0; width: ${store.virtualizerX.getTotalSize()}px; height: ${store.virtualizerY.getTotalSize()}px; z-index: -1`} />
          </Dynamic>
        )
      },
      td: ({ td }, { store }) => (o) => {
        const ml = createMemo(() => store[$ML]()[o.x])
        o = combineProps(() => ({ style: `width: ${o.col.width || 80}px; margin-left: ${ml()?.offset}px` }), o)
        return <Dynamic component={td} {...o} />
      },
      th: ({ th }, { store }) => (o) => {
        const ml = createMemo(() => store[$ML]?.()[o.x])
        let el
        onMount(() => store.virtualizerX.measureElement(el))
        o = combineProps({ ref: e => el = e }, () => ({ style: `width: ${o.col.width || 80}px; margin-left: ${ml()?.offset}px` }), o)
        return <Dynamic component={th} {...o} />
      },
      tr: ({ tr }, { store }) => (o) => {
        let el
        onMount(() => store.virtualizerY.measureElement(el))
        o = combineProps({ ref: e => el = e }, o)
        return <Dynamic component={tr} {...o} />
      },
      thead: ({ thead }, { store }) => o => {
        o = combineProps(() => ({
          style: `transform: translate(${store.virtualizerX.getVirtualItems()[0]?.start}px, ${0}px);`
        }), o)
        return <Dynamic component={thead} {...o} />
      },
      tbody: ({ tbody }, { store }) => o => {
        o = combineProps(() => ({
          style: `transform: translate(${store.virtualizerX.getVirtualItems()[0]?.start}px, ${store.virtualizerY.getVirtualItems()[0]?.start}px);`
        }), o)
        return <Dynamic component={tbody} {...o} />
      },
      EachRows: ({ EachRows }, { store }) => (o) => {
        const { props } = useContext(Ctx)
        const keyed = createMemo(() => keyBy(store.virtualizerY.getVirtualItems(), e => e.key))
        return (
          <Dynamic component={EachRows} each={Object.keys(keyed())}>
            {(key, i) => {
              const item = keyed()[key]
              return o.children(props.data![item.index], () => item.index)
            }}
          </Dynamic>
        )
      },
      EachCells: ({ EachCells }, { store }) => (o) => {
        const list = createMemo(() => store.virtualizerX.getVirtualItems().map(e => o.each[e.index]))
        return (
          <Dynamic component={EachCells} {...o} each={list()}>
            {(e, i) => {
              const item = store.virtualizerX.getVirtualItems()[i()]
              return o.children(e, () => item.index)
            }}
          </Dynamic>
        )
      },
    }
  }
}