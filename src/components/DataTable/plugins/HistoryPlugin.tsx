import { createEffect, createMemo, useContext } from 'solid-js'
import { createUndoHistory } from '@solid-primitives/history'
import { trackStore, captureStoreUpdates } from '@solid-primitives/deep'
import { combineProps } from '@solid-primitives/props'
import { Ctx, type Plugin } from '../xxx'
import { log } from '@/utils'
import { createStore, reconcile, unwrap } from 'solid-js/store'
import { useTinykeys } from '@/hooks'

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
    createEffect(() => log(getDelta()))
    const [data, setData] = createStore(store.rawProps.data!)
    let clonedState
    return ({
      historyData: data,
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

        const snapshot = log(clonedState)
        // store.historyData = snapshot
        // return () => store.historyData = reconcile(snapshot)(store.historyData)
        // return () => store.historyData = snapshot
        return () => setData(reconcile(snapshot))
        // return () => store.rawProps.onDataChange?.(snapshot)
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
    data: ({ data }, { store }) => (
      // data
      log(unwrap(store.historyData))
    )
  },
}
