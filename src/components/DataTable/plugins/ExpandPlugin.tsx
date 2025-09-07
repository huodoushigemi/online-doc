import { Dynamic } from 'solid-js/web'
import { createMemo, createSignal, useContext } from 'solid-js'
import { combineProps } from '@solid-primitives/props'
import { remove } from 'es-toolkit'
import { Ctx, type Plugin } from '../xxx'
import { unwrap,  } from 'solid-js/store'
import { log } from '../../../utils'

declare module '../xxx' {
  interface TableProps {
    expand: {

    }
  }
  interface TableStore {
    expands: any[]
    $expandCol: TableColumn
  }
}

export function ExpandPlugin(): Plugin {
  return {
    store: () => ({
      $expandSymbol: Symbol('expand'),
      $expandCol: { id: Symbol('expand'), fixed: 'left', width: 45 },
      expands: []
    }),
    processProps: {
      columns: ({ columns }, { store }) => [
        store.$expandCol,
        ...columns!
      ],
      td: ({ td }, { store }) => o => {
        const flag = o.col.id == store.$expandCol.id
        if (!flag) return <Dynamic component={td} {...o} />

        const { props } = useContext(Ctx)

        const show = createMemo(() => !!store.expands.find(e => unwrap(e) == o.data))

        o = combineProps(o, { style: '', onClick: () => show() ? remove(store.expands!, e => unwrap(e) == o.data) : store.expands.push(o.data) })
        
        return (
          <Dynamic component={td} {...o}>
            <div style='display: flex; align-items: center; width: 100%; height: 100%; opacity: .4; pointer-events: none'>
              <ILucideChevronRight style={`transform: rotate(${show() ? 90 : 0}deg);`} />
            </div>
          </Dynamic>
        )
      },
      // EachRows: ({ EachRows }, { store }) => o => {
      //   return <Dynamic component={EachRows} {...o} />
      // },
      tr: ({ tr }, { store }) => o => {
        const flag = o.data?.[store.$expandSymbol]
        if (!flag) return <Dynamic component={tr} {...o} />
        
        const { props } = useContext(Ctx)
        return (
          <Dynamic component={tr} {...o}>
            <td colspan={props.columns?.length}>sadas</td>
          </Dynamic>
        )
      },
      data: ({ data }, { store }) => (
        store.expands.length
          ? data?.flatMap(e => store.expands.find(e2 => unwrap(e2) == unwrap(e)) ?  [e, { [store.$expandSymbol]: 1 }] : e)
          : data
      )
    }
  }
}
