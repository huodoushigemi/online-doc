import { createSignal } from 'solid-js'
import type { ColDef } from 'ag-grid-community'
import { defineCellEditor, defineCellRenderer } from './_utils'
import type { Field } from '../types'

export const field = {
  name: '公式',
  icon: () => <ILucideSquareFunction />,
  sort: 4
}

export const colDef = (field: Field): Partial<ColDef> => ({
  valueGetter: (props) => evaluateFormula(field.formula || '', props.data),
  cellRenderer: defineCellRenderer(props => {
    return <span>{evaluateFormula(field.formula || '', props.data)}</span>;
  }),
  cellEditor: defineCellEditor(props => {
    const [val, setVal] = createSignal(field.formula || '');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // 
      } else if (e.key === 'Escape') {
        props.onCancel();
      }
    };
    return <textarea
      value={val()}
      onInput={e => setVal(e.currentTarget.value)}
      onBlur={() => (field.formula = val(), props.onCancel())}
      on:keydown={handleKeyDown}
      style={{ width: '100%' }}
      autofocus
    />
  }),
  editable: true,
  cellEditorPopup: true
})

// 评估公式
const evaluateFormula = (formula: string, data: any) => {
  try {
    const ctx = { data }
    return (new Function(...Object.keys(ctx), `return ` + formula))(...Object.values(ctx))
  } catch (error) {
    return '公式错误'
  }
}