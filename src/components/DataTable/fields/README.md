该文件夹用于声明 字段类型，并实现对应的 渲染、编辑器、校验

示例

```tsx
import { createSignal, onCleanup } from 'solid-js'
import { defineCellRenderer, defineCellEditor } from './_utils'

// 导出渲染器
export const CellRenderer = defineCellRenderer(props => {
  return <span>{props.value ?? ''}</span>
})

// 导出编辑器
export const CellEditor = defineCellEditor(props => {
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

// 导出校验器
export function cellValidator(value) {
  return true;
}
```