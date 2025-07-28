import { createSignal } from 'solid-js';
import { defineCellRenderer, defineCellEditor } from './_utils';

export const CellRenderer = defineCellRenderer(props => {
  return <span>{props.value ?? ''}</span>;
});

export const CellEditor = defineCellEditor(props => {
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
      value={val()}
      onInput={e => setVal(e.currentTarget.value)}
      onBlur={() => props.onCommit(val())}
      onKeyDown={handleKeyDown}
      style={{ width: '100%' }}
      autofocus
    />
  );
});

export function cellValidator(value: any) {
  return true;
} 