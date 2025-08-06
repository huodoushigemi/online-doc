import { createEffect, createMemo, createSignal, For } from 'solid-js';
import type { ColDef } from 'ag-grid-community';
import { defineCellRenderer, defineCellEditor } from './_utils';
import type { Field } from '../types'
import { isFunction, isPlainObject, isPromise, isString } from 'es-toolkit';
import { useMemoAsync } from '../../../hooks';
import { combineProps } from '@solid-primitives/props';

export const colDef = (field: Field): Partial<ColDef> => ({
  cellRenderer: defineCellRenderer(props => {
    const options = resolveOptions(field.options);
    return <Label value={props.value} options={options} />
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
      <div
        class='block h-full'
        style={`width: ${props.column.getActualWidth()}px`}
        on:keydown={handleKeyDown}
        onBlur={() => props.onCommit(val())}
        tabindex='0'
      >
        <Label class='p-3 bg-#fff' b='[1px] solid [#000]' value={props.value} options={options} />
        <ul class="menu bg-[--menu-bg] rounded-box z-1 w-full shadow-sm my-0">
          <For each={options}>{opt => (
            <li onClick={() => props.onCommit(opt.value)}>
              <a class={`flex items-center gap-1 ${opt.value == props.value && 'menu-active'}`}>
                {opt.color && <div class='w-3 h-3' style={`background: ${opt.color}`} />}
                {opt.label ?? opt.value}
              </a>
            </li>
          )}</For>
        </ul>
      </div>
    );
  }),
  cellEditorPopup: true
});

export function cellValidator(value: any, options: string[] = []) {
  return options.length === 0 || options.includes(value);
}

function Label(props) {
  const opt = createMemo(() => props.options.find(e => e.value == props.value))
  return (
    <div {...combineProps(props, { class: 'flex items-center gap-1' })}>
      {opt()?.color && <div class='w-3 h-3 flex-shrink-0' style={`background: ${opt().color}`} />}
      <span class=''>{opt()?.label ?? opt()?.value}</span>
    </div>
  )
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