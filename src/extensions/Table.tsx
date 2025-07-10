import { findParentNode, findParentNodeClosestToPos, type Editor } from '@tiptap/core'
import { createEffect, createMemo, useTransition } from 'solid-js'
import { xor } from 'es-toolkit'
import { useEditorTransaction } from '../Editor'
import { log } from '../utils'
import { Floating } from '../components/Popover'
import { Menu } from '../components/Menu'

export const menus = []

const menus2 = (editor: Editor) => {
  editor.state.doc.nodeAt
  const name = ['tableCell', 'tableHeader']
  const cell = useEditorTransaction(editor, editor => (
    editor.state.selection.ranges.map(e => findParentNodeClosestToPos(e.$from, e => name.includes(e.type.name))?.node).filter(e => e)
  ), {
    equals: (a, b) => !xor(a || [], b || []).length
  })

  return createMemo(() => {
    if (!cell().length) return
    const ret = [] as any[]

    if (cell().length == 1) {
      if (cell()[0]!.attrs.colspan > 1 || cell()[0]?.attrs.rowspan > 1) {
        ret.push({ icon: <IMySplitCell />, cb: () => editor.chain().splitCell().focus().run() })
      }
    }
    else if (cell().length > 1) {
      ret.push({ icon: <IMyMergeCell />, cb: () => editor.chain().mergeCells().focus().run() })
    }

    ret.push({ icon: <ILucideTrash2 />, class: 'text-nowrap', children: [
      { label: '删除行', cb: () => editor.chain().deleteRow().focus().run() },
      { label: '删除列', cb: () => editor.chain().deleteColumn().focus().run() },
    ] })

    return ret
  })
}

export const mounted = (editor: Editor) => {
  const table = useEditorTransaction(editor, editor => findParentNodeClosestToPos(editor.state.selection.$from, node => node.type.name == 'table'))
  // editor.

  const toRect = (e) => DOMRect.fromRect({ x: e.left, y: e.top, width: e.right - e.left, height: e.bottom - e.top })
  const rect = useEditorTransaction(editor, editor => table() && toRect(editor.view.coordsAtPos(table()!.pos)))

  createEffect(() => {
    // if (!table()) return
    if (!rect()) return
    <Floating
      reference={{ getBoundingClientRect: () => rect()! }}
      floating={<Menu items={menus2(editor)} />}
      placement={'top-end'}
      portal={document.body}
    />
  })
}
