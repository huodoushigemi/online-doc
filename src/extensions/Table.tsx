import { findParentNode, findParentNodeClosestToPos, NodeView, type Editor, type NodeViewRenderer } from '@tiptap/core'
import { createEffect, createMemo, useTransition } from 'solid-js'
import { xor } from 'es-toolkit'
import { useActive, useEditorTransaction } from '../Editor'
import { Floating } from '../components/Popover'
import { Menu } from '../components/Menu'
import { Table as _Table, TableView } from '@tiptap/extension-table'

class View extends TableView implements ReturnType<NodeViewRenderer> {
  constructor(node, cellMinWidth) {
    super(node, cellMinWidth)
    this.table.style.fontSize = '22px'
  }
  destroy() {

  }
}

const addOptions = _Table.config.addOptions
_Table.config.addOptions = function() {
  return {
    ...addOptions?.call(this),
    View
  }
}

export { TableKit } from '@tiptap/extension-table'

export const menus = []

const menus2 = (editor: Editor) => {
  const name = ['tableCell', 'tableHeader']
  const cell = useEditorTransaction(editor, editor => (
    editor.state.selection.ranges.map(e => findParentNodeClosestToPos(e.$from, e => name.includes(e.type.name))?.node).filter(e => e)
  ), {
    equals: (a, b) => !xor(a || [], b || []).length
  })

  return createMemo(() => {
    if (!cell().length) return
    const ret = [] as any[]

    ret.push({ label: '表头', isActive: useActive(editor, 'tableHeader'), cb: () => editor.chain().toggleHeaderCell().run() })

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
  const pos = useEditorTransaction(editor, editor => findParentNodeClosestToPos(editor.state.selection.$from, node => node.type.name == 'table')?.pos)
  const rect = createMemo(() => pos() != null ? (editor.view.nodeDOM(pos()!) as HTMLElement)?.querySelector('& > table')?.getBoundingClientRect() : void 0)

  const menu = menus2(editor)
  
  createEffect(() => {
    if (!rect()) return
    <Floating
      reference={{ getBoundingClientRect: () => rect()! }}
      floating={<div><Menu x={true} items={menu()} /></div>}
      placement={'top-end'}
      portal={document.body}
    />
  })
}
