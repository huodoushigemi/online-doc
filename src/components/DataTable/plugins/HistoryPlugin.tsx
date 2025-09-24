import { unwrap } from 'solid-js/store'
import { createUndoHistory } from '@solid-primitives/history'
import { captureStoreUpdates } from '@solid-primitives/deep'
import { combineProps } from '@solid-primitives/props'
import { useTinykeys } from '@/hooks'
import { type Plugin } from '../xxx'

declare module '../xxx' {
  interface TableProps {
    history: {
      num: number
    }
  }
  interface TableStore {
    history: ReturnType<typeof createUndoHistory>
  }
}

export const HistoryPlugin: Plugin = {
  priority: Infinity,
  store: (store) => {
    const getDelta = captureStoreUpdates(store.rawProps.data!)
    let clonedState
    return ({
      history: createUndoHistory(() => {
        const delta = getDelta()
        if (!delta.length) return

        for (const { path, value } of delta) {
          if (path.length === 0) {
            clonedState = structuredClone(unwrap(value))
          } else {
            let target = { ...clonedState }
            for (const key of path.slice(0, -1)) {
              target[key] = Array.isArray(target[key]) ? [...target[key]] : { ...target[key] }
              target = target[key]
            }
            target[path[path.length - 1]!] = structuredClone(unwrap(value))
            clonedState = target
          }
        }

        const snapshot = clonedState
        return () => store.rawProps.onDataChange?.(snapshot)
      })
    })
  },
  processProps: {
    Table: ({ Table }, { store }) => o => {
      let el: HTMLBodyElement

      useTinykeys(() => el, {
        'Control+Z': () => store.history.undo(),
        'Control+Y': () => store.history.redo(),
      })

      o = combineProps({ ref: e => el = e, tabindex: -1 }, o)
      return <Table {...o} />
    },
  },
}
