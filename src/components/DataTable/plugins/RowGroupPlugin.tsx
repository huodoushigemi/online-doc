import { Dynamic } from 'solid-js/web'
import { groupBy, isEqual, remove } from 'es-toolkit'
import { Ctx, type Plugin } from '../xxx'
import { log } from '../../../utils'
import { createMemo, useContext } from 'solid-js'
import type { TableStore } from '../xxx'

declare module '../xxx' {
  interface TableProps {
    rowGroup?: {
      fields?: string[]
    }
  }
  interface TableStore {
    rowGroup: {
      expands: string[][]
      isExpand: (data) => boolean
      toggleExpand: (data) => void
    }
  }
}

export function RowGroupPlugin(): Plugin {
  return {
    store: (store) => ({
      rowGroup: {
        expands: [],
        isExpand: data => store.rowGroup.expands.some(e => isEqual(e, data[symbol].path)),
        toggleExpand: data => store.rowGroup.isExpand(data) ? remove(store.rowGroup.expands, e => isEqual(e, data[symbol].path)) : store.rowGroup.expands.push(data[symbol].path)
      }
    }),
    processProps: {
      td: ({ td }, { store }) => o => {
        if (!o.data?.[symbol]) return <Dynamic component={td} {...o} />
        
        const { props } = useContext(Ctx)
        const show = createMemo(() => store.rowGroup.isExpand(o.data))

        return (
          <Dynamic component={td} {...o}>
            {props.columns?.findIndex(e => !e[store.internal_col]) == o.x ? (
              <div class='flex aic' style={`padding-left: ${(o.data[symbol].path.length - 1) * 16}px`} onDblClick={() => store.rowGroup.toggleExpand(o.data)}>
                <div class='icon-clickable mr-2' onClick={() => store.rowGroup.toggleExpand(o.data)}>
                  <ILucideChevronRight style={`transform: rotate(${show() ? 90 : 0}deg); opacity: .6`} />
                </div>
                {o.data[symbol].value}
              </div>
            ) : o.children}
          </Dynamic>
        )
      },
      data: ({ data }, { store }) => (
        store.props?.rowGroup?.fields?.length
          ? expandData(data, store)
          : data
      )
    },
  }
}

const symbol = Symbol('row-group')

const expandData = (data, store: TableStore, path = [] as any[]) => {
  const { expands } = store.rowGroup
  const fields = store.props!.rowGroup!.fields!
  const col = store.props!.columns?.find(e => !e[store.internal_col])
  if (!col) return data
  if (fields.length == path.length) return data
  const obj = groupBy(data, e => e[fields[path.length]])
  return Object.keys(obj).flatMap(k => {
    const ks = [...path, k]
    const arr = expands.some(e => isEqual(ks, e))
      ? expandData(obj[k], store, ks)
      : []
    return [{ [col.id]: k, [symbol]: { path: ks, value: k } }, ...arr]
  })
}