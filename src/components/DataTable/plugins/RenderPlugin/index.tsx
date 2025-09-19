import { createComponent, createEffect, createMemo, createRoot, createSignal, mergeProps, on, onCleanup, onMount, useContext, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import { component } from 'undestructure-macros'
import { chooseFile, log } from '@/utils'
import { Ctx, type Plugin, type TableColumn, type TableProps, type TD } from '../../xxx'
import { Checkbox, Files } from './components'

declare module '../../xxx' {
  interface TableProps {

  }
  interface TableColumn {
    render?: string | Render
  }
  interface TableStore {
    renders: { [key: string]: Render }
  }
}

export type Render = (props: Parameters<TD>[0] & { onChange?: (v) => void }) => JSX.Element

export function RenderPlugin(): Plugin {
  return {
    priority: -Infinity,
    store: () => ({
      renders: {
        text,
        number,
        date,
        checkbox,
        file
      }
    }),
    processProps: {
      Td: ({ Td }, { store }) => o => {
        return (
          <Td {...o}>
            {(() => {
              const Comp = (e => typeof e == 'string' ? store.renders[e] : e)(o.col.render) || text
              return <Comp {...o} />
            })()}
          </Td>
        )
      }
    }
  }
}

const text: Render = component(({ data, col, onChange }) => {
  return (
    data[col.id]
  )
})

const number = text

const date = text

const checkbox: Render = component(({ data, col, onChange }) => {
  return (
    <div class='flex items-center h-full'>
      <Checkbox class='' value={data[col.id]} onChange={onChange} />
    </div>
  )
})

const file: Render = component(({ data, col, onChange }) => {
  return (
    <Files value={data[col.id]} onChange={onChange} disabled />
  )
})