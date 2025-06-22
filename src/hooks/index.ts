import { createMutationObserver } from '@solid-primitives/mutation-observer'
import { createEventListener } from '@solid-primitives/event-listener'
import { createPointerListeners } from '@solid-primitives/pointer'
import { access, type MaybeAccessor } from '@solid-primitives/utils'
import { createEffect, createRenderEffect, createRoot, createSignal, onCleanup } from 'solid-js'
import { createMutable } from 'solid-js/store'
import { makePersisted, storageSync } from '@solid-primitives/storage'
import { createPrefersDark } from '@solid-primitives/media'

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

export function model(el: any, value: () => [() => string, (v: string) => any]) {
  const [field, setField] = value()
  createRenderEffect(() => (el.value = field()))
  el.addEventListener("input", (e) => setField((e.target as HTMLInputElement).value))
}

export function toSignle<T extends Record<string, any>>(state: T, k: keyof T) {
  return [() => state[k], v => state[k] = v]
}

export function useDark() {
  const dark = makePersisted(createSignal(createPrefersDark()()), { name: 'color-schema', storage: localStorage, sync: storageSync, serialize: v => v ? 'dark' : '', deserialize: v => v == 'dark' })
  createEffect(() => document.documentElement.classList[dark[0]() ? 'add' : 'remove']('dark'))
  // window.addEventListener('storage', e => console.log(e.newValue, 'www'))
  return [dark[0], v => (dark[1](v), window.dispatchEvent(new StorageEvent('storage', { key: 'color-schema', newValue: JSON.stringify })))]
}

export function useMemoAsync<T>(fn: () => Promise<T> | T, init?: Awaited<T>) {
  const REJECT = Symbol()
  const [val, setVal] = createSignal(init)
  createEffect(async () => {
    const ret = fn()
    const v = ret instanceof Promise ? await new Promise((resolve) => {
      ret.then(resolve)
      onCleanup(() => resolve(REJECT))
    }) : ret
    v == REJECT || setVal(v)
  })
  return val
}