import { For } from 'solid-js'
import { component } from 'undestructure-macros'
import { combineProps } from '@solid-primitives/props'

export const Checkbox = component(({ value, onChange, ...props }) => {
  props = combineProps({ class: 'you-checkbox' }, props)
  return (
    <input checked={value || false} onChange={(e) => onChange(e.currentTarget.checked)} type="checkbox" {...props} />
  )
})

export const Files = component(({ ...props }) => {
  return (
    <Tags {...props} />
  )
})

export const Tags = component(({ value, children, disabled, onChange, onAdd, ...props }) => { 
  props = combineProps({ class: 'flex flex-wrap items-center gap-2 h-full' }, props)
  return (
    <div {...props}>
      <For each={value}>{e => (
        <Tag style={`background: ${e.color}`} disabled={disabled} onDel={() => onChange(value.filter(e2 => e2 != e))}>
          {children ? children(e) : (e?.text ?? e?.label ?? e?.name ?? e)}
        </Tag>
      )}</For>
      {!disabled && <Tag disabled onClick={onAdd}><ILucidePlus /></Tag>}
    </div>
  )
})

export const Tag = component(({ disabled, children, onDel, ...props }) => {
  props = combineProps({ class: 'flex items-center px-2 py-1 rd-sm bg-gray/20 text-3.5 lh-[1]' }, props)
  return (
    <div {...props}>
      {children}
      {!disabled && <ILucideX class='icon-clickable flex-shrink-0 size-4! ml-1 mr--1 op-75' onClick={onDel} />}
    </div>
  )
})
