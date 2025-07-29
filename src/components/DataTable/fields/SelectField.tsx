import { createSignal, For } from 'solid-js';
import type { ColDef } from 'ag-grid-community';
import { defineCellRenderer, defineCellEditor } from './_utils';
import type { Field } from '../types'

export const colDef = (field: Field): Partial<ColDef> => ({
  cellRenderer: defineCellRenderer(props => {
    const options = field.options || [];
    return <span>{options.find(e => e.value == props.value)?.label}</span>
  }),
  cellEditor: defineCellEditor(props => {
    const options = field.options || [];
    const [val, setVal] = createSignal(props.value ?? (options[0] ?? ''));
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        props.onCommit(val());
      } else if (e.key === 'Escape') {
        props.onCancel();
      }
    };
    return (
      <select
        value={val()}
        onInput={e => setVal(e.currentTarget.value)}
        onBlur={() => props.onCommit(val())}
        onKeyDown={handleKeyDown}
        style={{ width: '100%' }}
        autofocus
      >
        <For each={options}>{opt => <option value={opt.value}>{opt.label}</option>}</For>
      </select>
    );
  })
});

export function cellValidator(value: any, options: string[] = []) {
  return options.length === 0 || options.includes(value);
} 