import { createMemo, createRoot, createSignal, mergeProps, onCleanup, useContext, type JSX } from 'solid-js'
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
        
        o = combineProps(() => editing() ? { style: 'padding: 0' } : {}, { onDblClick: () => setEditing(true) }, o)
        return (
          <Dynamic component={td} {...o}>
            {editorState()?.el || o.children}
          </Dynamic>
        )
      }
    }
  }
}

const input: Editor = (props) => createRoot(destroy => {
  return {
    el: <input class='relative z-9 w-full h-full box-border bg-#00' value={props.value} onpointerdown={e => e.stopPropagation()} />,
    getValue: () => 0,
    destroy
  }
})