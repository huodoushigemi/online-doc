import { combineProps } from '@solid-primitives/props'
import { For, type Component } from 'solid-js'

export const Checkbox: Component<any> = ({ value, onChange, ...props }) => {
  props = combineProps({ class: 'you-checkbox' }, props)
  return (
    <input checked={value} onChange={(e) => onChange(e.currentTarget.checked)} type="checkbox" {...props} />
  )
}

export const Files: Component<any> = ({ ...props }) => {
  return (
    <Tags {...props}>{item => {
      item.name
    }}</Tags>
  )
}

export const Tags: Component<any> = ({ value, children, disabled, onChange, onAdd, ...props }) => { 
  props = combineProps({ class: 'flex flex-wrap gap-2' }, props)
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
}

export const Tag: Component<any> = ({ disabled, children, onDel, ...props }) => {
  props = combineProps({ class: 'px-2 py-1 rd-sm bg-gray/20' }, props)
  return (
    <div {...props}>
      {children}
      {!disabled && <ILucideX onClick={onDel} />}
    </div>
  )
}