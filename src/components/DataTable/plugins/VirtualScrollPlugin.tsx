import { createEffect, createMemo, createSignal, onMount, useContext } from 'solid-js'
import { Dynamic, style } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { Ctx, type Plugin } from '../xxx'
import { log } from '../../../utils'
import { keyBy } from 'es-toolkit'

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
        })

        // virtualizerY.getVirtualItems()[0].start

        const virtualizerX = createVirtualizer({
          getScrollElement: () => el,
          count: props.columns?.length || 0,
          estimateSize: () => 80,
        })

        store.virtualizerY = virtualizerY
        store.virtualizerX = virtualizerX

        return (
          <div ref={e => el = e} style={`height: 600px; width: 600px; overflow: auto`}>
            <Dynamic component={table} {...o} />
          </div>
        )
      },
      // td: ({ td }, { store }) => (o) => {
        
      //   return <Dynamic component={td} {...o} />
      // },
      tbody: ({ tbody }, { store }) => o => {
        const mergedProps = combineProps(o, () => ({
          style: `transform: translate(0, ${store.virtualizerY.getVirtualItems()[0]?.start}px)`
        }))
        return <Dynamic component={tbody} {...mergedProps}>{o.children}</Dynamic>
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
      }
    }
  }
}