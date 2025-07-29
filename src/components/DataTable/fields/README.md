该文件夹用于声明 字段类型，并实现对应的 渲染、编辑器、校验

示例

```tsx
import { createSignal, onCleanup } from 'solid-js'
import type { ColDef } from 'ag-grid-community';
import { defineCellRenderer, defineCellEditor } from './_utils'
import type { Field } from '../types'

export const colDef = (field: Field): Partial<ColDef> => ({
  // 渲染器
  cellRenderer: defineCellRenderer(props => {
    return <span>{props.value ?? ''}</span>
  }),
  // 编辑器
  cellEditor: defineCellEditor(props => {
    const [val, setVal] = createSignal(props.value ?? '')

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        props.onCommit(val())
      } else if (e.key === 'Escape') {
        props.onCancel()
      }
    };

    return (
      <input
        value={val()}
        onInput={e => setVal(e.currentTarget.value)}
        onBlur={() => props.onCommit(val())}
        onKeyDown={handleKeyDown}
        style={{ width: '100%' }}
        autofocus
      />
    )
  })
})
```