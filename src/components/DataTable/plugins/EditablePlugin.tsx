import { createEffect, createMemo, createRoot, createSignal, mergeProps, on, onCleanup, onMount, useContext, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import { Ctx, type Plugin, type TableColumn } from '../xxx'

declare module '../xxx' {
  interface TableProps {

  }
  interface TableColumn {
    editable?: boolean
    editor?: string | Editor
  }
  interface TableStore {
    editors: { [key: string]: Editor }
  }
}

export type Editor = (props: EditorProps) => {
  el: JSX.Element
  getValue: () => any
  destroy: () => void
  focus?: () => void
  blur?: () => void
}

export interface EditorProps {
  col: TableColumn
  data: any
  x: number
  y: number
  value: any
  eventKey?: string
  stopEditing: () => void
}

export function EditablePlugin(): Plugin {
  return {
    store: (store) => ({
      editors: {
        input
      }
    }),
    processProps: {
      td: ({ td }, { store }) => o => {
        const { props } = useContext(Ctx)
        const [editing, setEditing] = createSignal(false)

        const editorState = createMemo(() => {
          if (editing()) {
            const editor = (editor => typeof editor == 'string' ? store.editors[editor] : editor)(o.col.editor || 'input')
            const ret = editor(mergeProps(o, { value: props.data![o.y][o.col.id], stopEditing: () => setEditing(false) }))
            onCleanup(() => ret.destroy())
            return ret
          }
        })

        createEffect(() => {
          editorState()?.focus?.()
        })

        createEffect(() => {
          if (editing()) {
            const sss = createMemo(() => JSON.stringify(store.selected))
            createEffect(on(sss, () => setEditing(false), { defer: true }))
          }
        })
        
        o = combineProps(() => editing() ? { style: 'padding: 0' } : {}, { onDblClick: () => o.data[store.internal] || o.col[store.internal] || setEditing(true) }, o)
        return (
          <Dynamic component={td} {...o}>
            {editorState()?.el || o.children}
          </Dynamic>
        )
      }
    }
  }
}

const input: Editor = ({ stopEditing, eventKey, value }) => createRoot(destroy => {
  const [v, setV] = createSignal(eventKey || value)
  const el: HTMLElement = <input
    class='relative block size-full z-9 box-border resize-none'
    value={v() || ''}
    onInput={e => setV(e.target.value)}
    onKeyDown={e => e.key == 'Enter' ? stopEditing() : e.key == 'Escape' ? (setV(value), stopEditing()) : void 0}
    // onpointerdown={e => e.stopPropagation()}
  />
  
  return {
    el,
    getValue: () => v(),
    focus: () => el.focus(),
    destroy,
  }
})