import { createComponent, createEffect, createMemo, createRoot, createSignal, mergeProps, on, onCleanup, onMount, useContext, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import { chooseFile, log } from '@/utils'
import { Ctx, type Plugin, type TableColumn, type TableProps, type TD } from '../../xxx'
import { Checkbox, Files } from './components'

declare module '../../xxx' {
  interface TableProps {

  }
  interface TableColumn {
    render?: string | Render
  }
  interface TableStore {
    renders: { [key: string]: Render }
  }
}

export type Render = TD

export function RenderPlugin(): Plugin {
  return {
    store: () => ({
      renders: {

      }
    }),
    processProps: {
      td: ({ td }, { store }) => o => {
        return (
          <Dynamic component={td} {...o}>
            {(() => {
              const Comp = (e => typeof e == 'string' ? store.renders[e] : e)(o.col.render)
              return Comp ? <Comp {...o} /> : o.children
            })()}
          </Dynamic>
        )
      }
    }
  }
}