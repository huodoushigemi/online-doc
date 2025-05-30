import { createPointerListeners } from '@solid-primitives/pointer'
import { access, type MaybeAccessor } from '@solid-primitives/utils'
import { createRoot } from 'solid-js'

interface UseDragOptions {
  start?(
    e: PointerEvent,
    move: (cb: MoveCB) => void,
    end: (cb: EndCb) => void
  ): void,
}

type MoveCB = (e: PointerEvent, o: { sx: number, sy: number, ox: number, oy: number }) => void
type EndCb = (e: PointerEvent) => void

export function usePointerDrag(el: MaybeAccessor<HTMLElement | undefined>, options: UseDragOptions) {
  createPointerListeners({
    target: el,
    passive: false,
    onDown(e) {
      e.preventDefault()
      e.stopPropagation()
      const [sx, sy] = [e.x, e.y]

      let move: MoveCB | void
      let end: EndCb | void
      options.start?.(e, (cb) => move = cb, (cb) => end = cb)
      
      createRoot(dispose => {
        createPointerListeners({
          target: document,
          onMove(e) {
            const [ox, oy] = [e.x - sx, e.y - sy]
            move?.(e, { sx, sy, ox, oy })
          },
          onUp() {
            end?.(e)
            dispose()
            move = void 0
            end = void 0
          }
        })
      })
    }
  })
}