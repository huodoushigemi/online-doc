import { createSignal, For } from 'solid-js';
import { defineCellRenderer, defineCellEditor } from './_utils';

export const CellRenderer = defineCellRenderer(props => {
  return <span>{props.value ?? ''}</span>;
});

export const CellEditor = defineCellEditor(props => {
  const options: string[] = props.options || props.colDef?.cellEditorParams?.values || [];
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
      <For each={options}>{opt => <option value={opt}>{opt}</option>}</For>
    </select>
  );
});

export function cellValidator(value: any, options: string[] = []) {
  return options.length === 0 || options.includes(value);
} 