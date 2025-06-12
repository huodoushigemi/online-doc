import { children, createEffect, createMemo, createSignal, splitProps } from 'solid-js'
import { Portal } from 'solid-js/web'
import { autoUpdate, createFloating, type createFloatingProps, type ReferenceType } from 'floating-ui-solid'
import { pointerHover } from '@solid-primitives/pointer'
import { delay } from 'es-toolkit'
import { createEventListener } from '@solid-primitives/event-listener'
import { useMemoAsync } from '../hooks'

export function Popover(attrs: FloatingProps) {
  const [_, props] = splitProps(attrs, ['reference', 'floating'])
  
  const log = v => (console.log(v), v)
  const [hover, setHover] = createSignal(false)
  const show = useMemoAsync(() => hover() ? delay(100).then(() => true) : delay(200).then(() => false))

  const reference = children(() => attrs.reference as HTMLElement)
  const floating = children(() => show() ? attrs.floating as HTMLElement : void 0)

  createEventListener(() => [reference(), floating()].filter(e => log(e)), 'pointerenter', () => setHover(true))
  createEventListener(() => [reference(), floating()].filter(e => log(e)), 'pointerleave', () => setHover(false))

  return <Floating {...props} reference={reference} floating={floating} />
}

type FloatingProps = {
  reference: ReferenceType
  floating?: HTMLElement
  portal?: HTMLElement
} & createFloatingProps

export function Floating(attrs: FloatingProps) {
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