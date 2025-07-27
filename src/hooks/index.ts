import { createMutationObserver } from '@solid-primitives/mutation-observer'
import { createEventListener } from '@solid-primitives/event-listener'
import { createPointerListeners } from '@solid-primitives/pointer'
import { access, type Many, type MaybeAccessor } from '@solid-primitives/utils'
import { createComputed, createEffect, createRenderEffect, createRoot, createSignal, onCleanup, type Signal } from 'solid-js'
import { createMutable } from 'solid-js/store'
import { makePersisted, storageSync } from '@solid-primitives/storage'
import { createPrefersDark } from '@solid-primitives/media'
import { log, unFn } from '../utils'
import { isFunction, isPromise } from 'es-toolkit'

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
  const get = v => v == 'dark' || (prefersDark() && !v), set = v => v ? 'dark' : 'light'
  const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches
  const dark = makePersisted(createSignal(prefersDark()), { name: 'color-schema', storage: localStorage, sync: storageSync, serialize: set, deserialize: get })
  createEffect(() => document.documentElement.classList[dark[0]() ? 'add' : 'remove']('dark'))
  createEffect(() =>  window.dispatchEvent(new StorageEvent('storage', { key: 'color-schema', newValue: set(dark[0]()) })))
  return dark
}

export function useMemoAsync<T>(fn: () => Promise<T> | T, init?: Awaited<T>) {
  const REJECT = Symbol()
  const [val, setVal] = createSignal(init)
  createComputed(async () => {
    const ret = fn()
    const v = ret instanceof Promise ? await new Promise((resolve) => {
      ret.then(resolve)
      onCleanup(() => resolve(REJECT))
    }) : ret
    v == REJECT || setVal(() => v)
  })
  return val
}

export function useSignle2<T>(v: T | (() => T), opt?: { before?: (v: T) => Promise<T | void> | T }) {
  const state = createSignal(isFunction(v) ? void 0 : v)
  const before = v => {
    const v2 = opt?.before?.(v)
    return isPromise(v2) ? v2.then(v3 => v3 === void 0 ? v : v3) : v2 ?? v
  }
  
  const val = useMemoAsync(() => before(state[0]() as T))

  if (isFunction(v)) {
    const fned = useMemoAsync(() => before(v()))
    createComputed(() => state[1](fned()))
  }

  return [val, state[1]] as Signal<T>
}

export function useHover(el: MaybeAccessor<Many<HTMLElement | undefined>>) {
  const [hover, setHover] = createSignal(false)
  createEventListener(el, 'pointerenter', () => setHover(true))
  createEventListener(el, 'pointerleave', () => setHover(false))
  return hover
}

export function useMouseDown(el: MaybeAccessor<Many<HTMLElement | undefined>>) {
  const [down, setDown] = createSignal(false)
  createEventListener(el, 'pointerdown', () => setDown(true))
  createEventListener(document.body, 'pointerup', () => setDown(false))
  return down
}