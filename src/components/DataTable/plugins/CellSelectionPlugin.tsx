import { batch, createEffect, createMemo, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import { createEventListener } from '@solid-primitives/event-listener'
import { type MaybeAccessor } from '@solid-primitives/utils'
import { Ctx, type Plugin } from '../xxx'
import { usePointerDrag } from '../../../hooks'
import { log } from '../../../utils'
import { difference } from 'es-toolkit'

declare module '../xxx' {
  interface TableProps {
    
  }
  interface TableStore {
    selected: { start: number[]; end: number[] }
  }
}

export function CellSelectionPlugin(): Plugin {
  const inrange = (v, min, max) => v <= max && v >= min
  return {
    store: () => ({
      selected: { start: [], end: [] }
    }),
    processProps: {
      thProps: ({ thProps }, { store }) => (o) => {
        const { start, end } = store.selected
        const inx = inrange(o.x, ...[start[0], end[0]].sort((a, b) => a - b))
        return combineProps(thProps?.(o) || {}, { class: inx ? 'col-range-highlight' : '' })
      },
      td: ({ td }, { store }) => (o) => {
        const clazz = createMemo(() => {
          const { start, end } = store.selected
          let clazz = ''
          const xs = [start[0], end[0]].sort((a, b) => a - b)
          const ys  = [start[1], end[1]].sort((a, b) => a - b)
          const inx = inrange(o.x, ...xs)
          const iny = inrange(o.y, ...ys)
          if (inx && iny) {
            clazz += 'range-selected '
            if (o.x == xs[0]) clazz += 'range-selected-l '
            if (o.x == xs[1]) clazz += 'range-selected-r '
            if (o.y == ys[0]) clazz += 'range-selected-t '
            if (o.y == ys[1]) clazz += 'range-selected-b '
          }
          if (o.col.id == store.$index?.id && iny) clazz += 'row-range-highlight '
          return clazz
        })

        const mergedProps = combineProps(() => ({ class: clazz(), tabindex: -1 }), o)
        
        return <Dynamic component={td} {...mergedProps} />
      },
      table: ({ table }, { store }) => (o) => {
        let el: HTMLElement
        const { props } = useContext(Ctx)
        
        usePointerDrag(() => el, {
          start(e, move, end) {
            batch(() => {
              const findCell = (e: PointerEvent) => e.composedPath().find((e) => e.tagName == 'TH' || e.tagName == 'TD') as Element
              const cell = findCell(e)
              if (!cell) return
              if (cell.tagName == 'TH') {
                store.selected.start = [+cell.getAttribute('x')!, 0]
                store.selected.end = [+cell.getAttribute('x')!, Infinity]
                move(e => {
                  const cell = findCell(e)
                  if (!cell) return
                  store.selected.end = [+cell.getAttribute('x')!, Infinity]
                })
              }
              if (cell.classList.contains('index')) {
                store.selected.start = [0, +cell.getAttribute('y')!]
                store.selected.end = [Infinity, +cell.getAttribute('y')!]
                move(e => {
                  const cell = findCell(e)
                  if (!cell) return
                  store.selected.end = [Infinity, +cell.getAttribute('y')!]
                })
              }
              else if (cell.tagName == 'TD') {
                store.selected.start = [+cell.getAttribute('x')!, +cell.getAttribute('y')!]
                store.selected.end = [...store.selected.start]
                move(e => {
                  const cell = findCell(e)
                  if (!cell) return
                  store.selected.end = [+cell.getAttribute('x')!, +cell.getAttribute('y')!]
                })
              }
            })
          },
        })

        keymap(() => el, '←', () => {
          const { start, end } = store.selected
          start[0] = end[0] = Math.max(start[0] - 1, 0)
          end[1] = start[1]
          scrollIntoView()
        })
        keymap(() => el, '→', () => {
          const { start, end } = store.selected
          start[0] = end[0] = Math.min(start[0] + 1, props.columns!.length - 1)
          end[1] = start[1]
          scrollIntoView()
        })
        keymap(() => el, '↑', () => {
          const { start, end } = store.selected
          start[1] = end[1] = Math.max(start[1] - 1, 0)
          end[0] = start[0]
          scrollIntoView()
        })
        keymap(() => el, '↓', () => {
          const { start, end } = store.selected
          start[1] = end[1] = Math.min(start[1] + 1, props.data!.length - 1)
          end[0] = start[0]
          scrollIntoView()
        })

        const scrollIntoView = () => {
          const cell = el.querySelector(`td[x="${store.selected.start[0]}"][y="${store.selected.start[1]}"]`)
          cell.scrollIntoViewIfNeeded(false)
          cell.focus()
        }
        
        return (
          <Dynamic
            component={table}
            {...combineProps(o, { ref: e => el = e })}
          />
        )
      }
    }
  }
}

function keymap(el: MaybeAccessor<HTMLElement>, keys: string, cb: (e: KeyboardEvent) => void) {
  const alias = {
    'ctrl': 'Control',
    '←': 'ArrowLeft',
    '→': 'ArrowRight',
    '↑': 'ArrowUp',
    '↓': 'ArrowDown',
    'lt': 'ArrowLeft',
    'rt': 'ArrowRight',
    'up': 'ArrowUp',
    'dn': 'ArrowDown',
  }
  const set = new Set<string>()
  createEventListener(el, 'keydown', e => {
    set.add(e.key.toLowerCase())
    if (set.size == keys.length && keys.split('+').every(k => set.has(alias[k]?.toLowerCase() ?? k))) {
      e.preventDefault()
      // batch(() => cb(e))
      cb(e)
    }
  })
  createEventListener(el, 'keyup', e => {
    set.delete(e.key.toLowerCase())
  })

  createEventListener(el, 'blur', () => set.clear())
}