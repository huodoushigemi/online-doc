import { children, createEffect, createMemo, splitProps } from 'solid-js'
import { Portal } from 'solid-js/web'
import { autoUpdate, createFloating, type createFloatingProps, type ReferenceType } from 'floating-ui-solid'

export function Popover(attrs: { reference: ReferenceType; floating?: HTMLElement; portal?: HTMLElement } & createFloatingProps) {
  const [_, props] = splitProps(attrs, ['reference', 'floating'])
  const reference = children(() => attrs.reference)
  const floating = children(() => attrs.floating)

  const style = createMemo(() => floating() ? createFloating({
    ...props,
    elements: { reference, floating },
    whileElementsMounted(ref, float, update) {
      return autoUpdate(ref, float, update, { ancestorResize: true,  elementResize: true, layoutShift: true, ancestorScroll: true })
    }
  }).floatingStyles : void 0)

  createEffect(() => {
    // console.log(props.floating)
    floating() && Object.assign(floating().style, style()?.() ?? {})
  })

  return (
    <>
      {reference()}
      {props.portal ? <Portal mount={props.portal}>{floating()}</Portal> : floating()}
    </>
  )
}