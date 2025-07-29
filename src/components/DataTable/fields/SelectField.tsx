import { createSignal, For } from 'solid-js';
import type { ColDef } from 'ag-grid-community';
import { defineCellRenderer, defineCellEditor } from './_utils';
import type { Field } from '../types'
import { isFunction, isPlainObject, isPromise, isString } from 'es-toolkit';
import { useMemoAsync } from '../../../hooks';

export const colDef = (field: Field): Partial<ColDef> => ({
  cellRenderer: defineCellRenderer(props => {
    const options = resolveOptions(field.options);
    return <span>{options.find(e => e.value == props.value)?.label}</span>
  }),
  cellEditor: defineCellEditor(props => {
    const options = resolveOptions(field.options);
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
        on:keydown={handleKeyDown}
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

const cache = new WeakMap

function resolveOptions(opts) {
  let ret = opts
  if (isFunction(ret)) ret = ret()
  if (isPromise(opts)) {
    if (cache.has(opts)) return cache.get(opts)()
    cache.set(opts, useMemoAsync(() => opts.then(opts => opts.map(e => resolveOpt(e)))))
    return cache.get(opts)()
  }
  return opts?.map(e => resolveOpt(e)) || []
}

function resolveOpt(opt) {
  return (
    isPlainObject(opt) ? opt :
    Array.isArray(opt) ? { label: opt[0], value: opt[1] } :
    { label: opt, value: opt }
  )
}