import { createSignal } from 'solid-js';
import type { ColDef } from 'ag-grid-community';
import { defineCellRenderer, defineCellEditor } from './_utils';
import type { Field } from '../types';

export const colDef = (field: Field): Partial<ColDef> => ({
  cellRenderer: defineCellRenderer(props => {
    return <span>{props.value != null ? props.value : ''}</span>;
  }),
  cellEditor: defineCellEditor(props => {
    const [val, setVal] = createSignal(props.value != null ? props.value : '');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        props.onCommit(val() === '' ? null : Number(val()));
      } else if (e.key === 'Escape') {
        props.onCancel();
      }
    };
    return (
      <input
        type="number"
        value={val()}
        onInput={e => setVal(e.currentTarget.value)}
        onBlur={() => props.onCommit(val() === '' ? null : Number(val()))}
        onKeyDown={handleKeyDown}
        style={{ width: '100%' }}
        autofocus
      />
    );
  })
});

export function cellValidator(value: any) {
  return value === null || value === '' || !isNaN(Number(value));
} 