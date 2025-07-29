import { createSignal } from 'solid-js';
import type { ColDef } from 'ag-grid-community';
import { defineCellRenderer, defineCellEditor } from './_utils';
import type { Field } from '../types';

export const colDef = (field: Field): Partial<ColDef> => ({
  cellRenderer: defineCellRenderer(props => {
    return <span>{props.value ?? ''}</span>;
  }),
  cellEditor: defineCellEditor(props => {
    const [val, setVal] = createSignal(props.value ?? '');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        props.onCommit(val());
      } else if (e.key === 'Escape') {
        props.onCancel();
      }
    };
    return (
      <input
        type="date"
        value={val()}
        onInput={e => setVal(e.currentTarget.value)}
        onBlur={() => props.onCommit(val())}
        on:keydown={handleKeyDown}
        style={{ width: '100%' }}
        autofocus
      />
    );
  })
})

export function cellValidator(value: any) {
  if (!value) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
} 