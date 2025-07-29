import type { ColDef } from 'ag-grid-community'
import { defineCellEditor, defineCellRenderer } from './_utils'
import type { Field } from '../types'

export const colDef = (field: Field): Partial<ColDef> => ({
  cellRenderer: defineCellRenderer(props => {
    return <span>{evaluateFormula(field.formula || '', props.data)}</span>;
  }),
  cellEditor: defineCellEditor(() => {
    return <div></div>;
  })
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