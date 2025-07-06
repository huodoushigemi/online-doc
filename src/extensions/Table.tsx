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
  ])
  createEffect(() => {
    log(cell())
  })
  return createMemo(() => {
    const [start, end] = cell()
    if (!start || !end) return
    const ret = [] as any[]
    // merge
    ret.push({ icon: <IMySplitCell /> })
    // muti
    if (start != end) ret.push([{ icon: <IMyMergeCell /> }])
    return ret
  })
}
