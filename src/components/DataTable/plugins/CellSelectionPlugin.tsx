import { batch, createEffect, createMemo, onMount, splitProps, useContext, type Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { component } from 'undestructure-macros'
import { Ctx, type Plugin } from '../xxx'
import { combineProps } from '@solid-primitives/props'
import { usePointerDrag } from '../../../hooks'
import { createEventListener } from '@solid-primitives/event-listener'
import { createShortcut, useKeyDownList } from '@solid-primitives/keyboard'
import { access } from '@solid-primitives/utils'
import { log } from '../../../utils'

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

        const mergedProps = combineProps(o, () => ({ class: clazz() }))
        
        return <Dynamic component={td} {...mergedProps} />
      },
      table: ({ table }, { store }) => (o) => {
        let el: HTMLElement
        usePointerDrag(() => el, {
          start(e, move, end) {
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
          },
        })
        keymap(() => el,'ctrl+b', () => {
          alert('ctrl+b')
        })
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

function keymap(el, keys: string, cb: (e: KeyboardEvent) => void) {
  const alias = { ctrl: 'CONTROL' }
  createShortcut(keys.split('+').map(e => alias[e] ?? e.toUpperCase()), e => {
    if (document.activeElement != access(el)) return
    cb(e!)
  })
}