import { batch, createEffect, createMemo, onMount, splitProps, useContext, type Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { component } from 'undestructure-macros'
import { Ctx, type Plugin } from '../xxx'
import { combineProps } from '@solid-primitives/props'
import { usePointerDrag } from '../../../hooks'
import { createEventListener } from '@solid-primitives/event-listener'
import { log } from '../../../utils'

export function CopyPlugin(): Plugin {
  return {
    processProps: {
      table: ({ table }, { store }) => component(({ children, ...props }) => {
        let el: HTMLElement
        const ctx = useContext(Ctx)

        createEventListener(() => el, 'pointerdown', () => {
          el.focus({ preventScroll: true })
        })

        createEventListener(() => el, 'keydown', e => {
          const { start, end } = store.selected
          if (start.length == 0) return
          if (e.key.toLowerCase() == 'c' && e.ctrlKey) {
            e.preventDefault()
            e.stopPropagation()
            const [x1, x2] = [start[0], end[0]].sort((a, b) => a - b)
            const [y1, y2] = [start[1], end[1]].sort((a, b) => a - b)
            const cols = ctx.props.columns!.slice(x1, x2 + 1)
            const data = ctx.props.data!.slice(y1, y2 + 1).map(row => cols.map(col => row[col.id]))
            const text = data.map(row => row.join('\t')).join('\n')
            navigator.clipboard.writeText(text)
            el.classList.add('copied')
          }
        })

        createEffect(() => {
          JSON.stringify(store.selected)
          el.classList.remove('copied')
        })

        return (
          <Dynamic component={table} tabindex={-1} {...combineProps(props, { ref: e => el = e })}>
            {children}
          </Dynamic>
        )
      })
    }
  }
}

export function PastePlugin(): Plugin {
  return {
    processProps: {
      table: ({ table }, { store }) => component(({ children, ...props }) => {
        let el: HTMLElement
        const ctx = useContext(Ctx)

        createEventListener(() => el, 'keydown', async e => {
          const { start } = store.selected
          if (start.length == 0) return
          if (e.key.toLowerCase() == 'v' && e.ctrlKey) {
            e.preventDefault()
            e.stopPropagation()
            const text = await navigator.clipboard.readText()
            const arr2 = text.split('\n').map(row => row.split('\t'))
            const cols = ctx.props.columns!.slice(start[0], start[0] + arr2[0].length)
            batch(() => {
              arr2.forEach((row, y) => {
                row = Object.fromEntries(cols.map((col, x) => [col.id, row[x]]))
                ctx.props.data![start[1] + y] = { ...ctx.props.data![start[1] + y], ...row }
              })
              store.selected.end = [start[0] + cols.length - 1, Math.min(start[1] + arr2.length - 1, ctx.props.data!.length - 1)]
            })
            ctx.props.onDataChange?.(ctx.props.data!.slice())
          }
        })
        
        return (
          <Dynamic component={table} tabindex={-1} {...combineProps(props, { ref: e => el = e })}>
            {children}
          </Dynamic>
        )
      })
    }
  }
}