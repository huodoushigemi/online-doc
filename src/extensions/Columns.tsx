import { Editor, findChildren, findParentNode, Node, type NodeViewRenderer, type NodeViewRendererProps, findParentNodeClosestToPos } from '@tiptap/core'
import { Columns } from '../components/Columns'
import { createNodeView } from './NodeView'
import { createEffect, createMemo } from 'solid-js'
import { isFocus, useEditorTransaction, useNodeAttrs } from '../Editor'
import { model } from '../hooks'
import { log, parseStyle } from '../utils'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      insertColumns: (options?: Partial<{cols: number; gap: number}>) => ReturnType
      addColAfter: (options?: { index: number; pos: number }) => ReturnType
    }
  }
}

export const ColumnsKit = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+',
  parseHTML: () => [{ tag: '[tiptap-is="columns"]' }],
  addAttributes: () => ({
    gap: { parseHTML: el => el.getAttribute('gap') ? +el.getAttribute('gap')! : 0 },
    'tiptap-is': { default: 'columns' }
  }),
  renderHTML: ({ node }) => ['div', { ...node.attrs }, 0],
  addNodeView: () => props => {
    const add = (index: number) => props.editor.commands.addColAfter({ index, pos: props.getPos()! })
    return createNodeView(attrs => <Columns {...attrs} onAdd={add} />, { syncAttrs: ['style', 'gap'], contentDOM: el => el })(props)
  },
  addExtensions: () => [ColExt],
  addCommands: () => ({
    insertColumns: ({ cols = 2, gap = 24 } = {}) => ({ editor, tr, chain }) => {
      chain().insertContent([
        `<div tiptap-is='columns' gap=${gap}>`,
          ...Array(cols).fill(0).map((e, i) => `<div tiptap-is='column'><p></p></div>`),
        `</div>`
      ].join(''))
      return true
    },
    addColAfter: ({ index = 0, pos = 0 } = {}) => (e) => {
      const node = e.state.doc.resolve(pos + 1).node().children[index + 1]
      pos = findChildren(e.editor.state.doc, e => e == node)[0].pos
      e.chain().insertContentAt(pos, `<div tiptap-is='column'><p></p></div>`)
      return true
    }
  })
})

const El = props => <div {...props} />

const ColExt = Node.create({
  name: 'column',
  content: 'paragraph block*',
  parseHTML: () => [{ tag: '[tiptap-is="column"]' }],
  addAttributes: () => ({
    style: { parseHTML: el => `padding: 12px 0; ${el.style.cssText}` },
    'tiptap-is': { default: 'column' }
  }),
  renderHTML: ({ node }) => ['div', { ...node.attrs }, 0],
  addNodeView: () => createNodeView(El, { syncAttrs: ['style'], contentDOM: el => el }),
})

const _Gap = props => {
  return (
    <label class='flex aic pl-1 w-3.5rem!'>
      <IMyGap class='text-4.5 op40' />
      <input use:model={props.gap} class='w-0 flex-1 b-0 bg-#00 outline-0 mt-[1px]' type='number' />
    </label>
  )
}

export const menus = (editor: Editor) => {
  const node = useEditorTransaction(editor, editor => findParentNodeClosestToPos(editor.state.selection.$from, node => node.type.name == 'columns')?.node)
  const attrs = createMemo(() => node() ? useNodeAttrs(editor, node())() : void 0)
  const gap = [() => +attrs()!.gap, gap => attrs()!.gap = +gap]
  
  return createMemo(() => {
    return attrs() ? [
      { is: _Gap, gap }
    ] : null
  })
}