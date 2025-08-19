import { createSignal } from 'solid-js';
import type { ColDef } from 'ag-grid-community';
import { defineCellRenderer, defineCellEditor } from './_utils';
import type { Field } from '../types'

export const field = {
  name: '文本',
  icon: () => <ISolarTextLinear />,
  sort: 0
}

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
        class='block h-full pl-4 outline-0 border-0'
        value={val()}
        onInput={e => setVal(e.currentTarget.value)}
        onBlur={() => props.onCommit(val())}
        on:keydown={handleKeyDown}
        style={{ width: '100%' }}
        autofocus
      />
    );
  })
});

export function cellValidator(value: any) {
  return true;
}

export const props = (field: Field) => [
  { lp: 'default-value' },
  { lp: 'required', displayValue: false }
]