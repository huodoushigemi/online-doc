import { access, type MaybeAccessor } from '@solid-primitives/utils'
import { round } from 'es-toolkit'
import type { MoveableProps } from 'moveable'
import { createEffect, createMemo, onCleanup } from 'solid-js'
import { useMemoAsync } from '../hooks'

export function Moveable(props: MoveableProps) {
  const view = <div />

  createEffect(() => {
    const ins = new moveable(view, {
      ...props,
      warpSelf: true,
    })
    onCleanup(() => {
      ins.destroy()
    })
  })

  return view
}

export function useMoveable(el: MaybeAccessor<HTMLElement>, opt?: MoveableProps) {
  const moveable = useMemoAsync(() => import('moveable').then(e => e.default))
  return createMemo(() => {
    if (opt?.disabled) return
    if (!moveable()) return
    const ins = new (moveable())(document.body, { target: access(el), resizable: true, origin: false, ...opt })
    ins.on('resize', e => {
      const el = e.target as HTMLElement
      const w = Math.max(e.width, 50), h = Math.max(e.height, 50)
      // Object.assign(e.target.style, { width: `${w}px`, height: `${h}px` })
      round(w) == round(el.offsetWidth) || (e.target.style.width = `${w}px`)
      round(h) == round(el.offsetHeight) || (e.target.style.height = `${h}px`)
    })
    onCleanup(() => ins.destroy())
    return ins
  })
}