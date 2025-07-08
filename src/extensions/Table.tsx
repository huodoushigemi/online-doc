import { findParentNode, findParentNodeClosestToPos, type Editor } from '@tiptap/core'
import { createEffect, createMemo, useTransition } from 'solid-js'
import { useEditorTransaction } from '../Editor'
import { log } from '../utils'

export const menus = (editor: Editor) => {
  // const mutiCell = 
  // editor.view.state.selection.
  // const
  // 
  // tableCell
  // tableHeader
  editor.state.doc.nodeAt
  const name = ['tableCell', 'tableHeader']
  const cell = useEditorTransaction(editor, editor => [
    findParentNodeClosestToPos(editor.state.selection.$from, e => name.includes(e.type.name))?.node,
    findParentNodeClosestToPos(editor.state.selection.$to, e => name.includes(e.type.name))?.node,
  ], {
    equals: (a, b) => a[0] == b[0] && a[1] == b[1]
  })

  // createEffect(() => {
  //   log(cell())
  // })

  // editor.state.selection.ranges

  return createMemo(() => {
    const [start, end] = cell()
    if (!start || !end) return
    const ret = [] as any[]
    ret.push({ icon: <IMySplitCell />, class: 'text-nowrap', children: [
      { label: '拆分行' },
      { label: '拆分列' },
    ] })
    // muti
    if (start != end) ret.push({ icon: <IMyMergeCell /> })
    return ret
  })
}
