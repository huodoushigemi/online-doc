import type { ColDef } from 'ag-grid-community'
import { defineCellEditor, defineCellRenderer } from './_utils'
import type { Field } from '../types'
import { createSignal } from 'solid-js';

export const colDef = (field: Field): Partial<ColDef> => ({
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
    let processedFormula = formula;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      processedFormula = processedFormula.replace(regex, data[key] || 0);
    });
    return eval(processedFormula);
  } catch (error) {
    return '公式错误'
  }
}