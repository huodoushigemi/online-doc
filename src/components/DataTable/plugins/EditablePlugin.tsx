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

export interface EditorProps extends Record<any, any> {
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
    store: () => ({
      editors: {
        text,
        number,
        range,
        date,
        time,
        datetime,
        color,
        tel,
        password,
        file,
      }
    }),
    processProps: {
      td: ({ td }, { store }) => o => {
        const { props } = useContext(Ctx)
        const [editing, setEditing] = createSignal(false)

        const editorState = createMemo(() => {
          if (editing()) {
            const editor = (editor => typeof editor == 'string' ? store.editors[editor] : editor)(o.col.editor || 'text')
            const ret = editor(mergeProps(o, { value: props.data![o.y][o.col.id], stopEditing: () => setEditing(false) }))
            onCleanup(() => {
              o.data[o.col.id] = ret.getValue()
              ret.destroy()
            })
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
        
        o = combineProps({
          get style() { return editing() ? `padding: 0; height: ${store.trSizes[o.y]?.height}px` : '' },
          onDblClick: () => o.data[store.internal] || o.col[store.internal] || setEditing(!!o.col.editable)
        }, o)
        return (
          <Dynamic component={td} {...o}>
            {editorState()?.el
              ? <div style={`height: 100%; box-sizing: border-box; padding: 0`}>{editorState()?.el}</div>
              : o.children
            }
          </Dynamic>
        )
      }
    }
  }
}

const BaseInput: Editor = ({ stopEditing, eventKey, value, col, ...attrs }) => createRoot(destroy => {
  const [v, setV] = createSignal(eventKey || value)
  const el: HTMLElement = <input
    class='relative block px-2 size-full z-9 box-border resize-none'
    value={v() || ''}
    onInput={e => setV(e.target.value)}
    on:pointerdown={e => e.stopPropagation()}
    on:keydown={e => {
      e.stopPropagation()
      e.key == 'Enter' ? stopEditing() : e.key == 'Escape' ? (setV(value), stopEditing()) : void 0
    }}
    {...attrs}
  />
  
  return {
    el,
    getValue: () => v(),
    focus: () => el.focus(),
    destroy,
  }
})

const text = BaseInput

const number: Editor = (props) => BaseInput({ ...props, type: 'number'  })
const range: Editor = (props) => BaseInput({ ...props, type: 'range'  })
const date: Editor = (props) => BaseInput({ ...props, type: 'date'  })
const time: Editor = (props) => BaseInput({ ...props, type: 'time'  })
const datetime: Editor = (props) => BaseInput({ ...props, type: 'datetime-local'  })
const color: Editor = (props) => BaseInput({ ...props, type: 'color'  })
const tel: Editor = (props) => BaseInput({ ...props, type: 'tel'  })
const password: Editor = (props) => BaseInput({ ...props, type: 'password'  })

// todo
const file: Editor = (props) => BaseInput({ ...props, type: 'file' })

// todo
const checkbox: Editor = ({ stopEditing, eventKey, value, col, ...attrs }) => createRoot(destroy => {
  const [v, setV] = createSignal(value)
  const el: HTMLElement = <input
    class='relative block px-2 size-full z-9 box-border resize-none'
    checked={v() || false}
    onChange={e => setV(e.target.checked)}
    type='checkbox'
    on:pointerdown={e => e.stopPropagation()}
    on:keydown={e => {
      e.stopPropagation()
      e.key == 'Enter' ? stopEditing() : e.key == 'Escape' ? (setV(value), stopEditing()) : void 0
    }}
    {...attrs}
  />
  
  return {
    el,
    getValue: () => v(),
    focus: () => el.focus(),
    destroy,
  }
})