import { Dynamic } from 'solid-js/web'
import { createMemo, createSignal, useContext } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import { unwrap } from 'solid-js/store'
import { combineProps } from '@solid-primitives/props'
import { remove } from 'es-toolkit'
import { Ctx, type Plugin, type TableStore } from '../xxx'
import { log } from '../../../utils'

declare module '../xxx' {
  interface TableProps {
    expand?: {
      render?: (props: { data: any, y: number }) => JSX.Element
    }
  }
  interface TableStore {
    expands: any[]
    expandCol: TableColumn
    isExpand: (data) => boolean
    toggleExpand: (data) => void
  }
}

export function ExpandPlugin(): Plugin {
  return {
    store: (store) => ({
      expands: [],
      expandCol: {
        id: Symbol('expand'),
        fixed: 'left',
        width: 45,
        render: (data, i) => <ArrowCell store={store} data={data} />,
        props: o => ({ onClick: () => store.toggleExpand(o.data) }),
        [store.internal_col]: 1
      },
      isExpand: data => !!store.expands.find(e => unwrap(e) == unwrap(data)),
      toggleExpand: (data) => store.isExpand(data) ? remove(store.expands!, e => unwrap(e) == unwrap(data)) : store.expands.push(unwrap(data))
    }),
    processProps: {
      columns: ({ columns }, { store }) => [
        store.expandCol,
        ...columns!
      ],
      tr: ({ tr }, { store }) => o => {
        const { props } = useContext(Ctx)
        const flag = o.data?.[store.expandCol.id]
        if (!flag) return <Dynamic component={tr} {...o} />

        return (
          <Dynamic component={tr} {...o}>
            <td colspan={props.columns?.length} style='width: 100%'>{props.expand?.render?.(o)}</td>
          </Dynamic>
        )

        // const show = createMemo(() => store.isExpand(o.data))
        
        // const { props } = useContext(Ctx)
        // return <>
        //   <Dynamic component={tr} {...o} />
        //   {show() && <tr style={`transform: translateY(-100%)`}>
        //     <div colspan={props.columns?.length}>sadas</div>
        //   </tr>}
        // </>
      },
      data: ({ data }, { store }) => (
        store.expands.length
          ? data?.flatMap(e => store.isExpand(e) ?  [e, { [store.expandCol.id]: 1 }] : e)
          : data
      )
    }
  }
}

const ArrowCell: Component<{ data: any, store: TableStore }> = ({ data, store }) => {
  const show = createMemo(() => store.isExpand(data))
  
  return (
    <div style='display: flex; align-items: center; width: 100%; height: 100%; opacity: .4'>
      <ILucideChevronRight style={`transform: rotate(${show() ? 90 : 0}deg);`} />
    </div>
  )
}