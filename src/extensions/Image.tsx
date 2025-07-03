import { createEffect, createMemo } from 'solid-js'
import { createMutable } from 'solid-js/store'
import { Editor, Node } from '@tiptap/core'
import { createNodeView } from './NodeView'
import { isSelcet, useEditorTransaction } from '../Editor'
import { useMoveable } from '../components/Moveable'
import { model, toSignle } from '../hooks'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (props: { src: string; style?: string }) => ReturnType
    }
  }
}

function _Image(props) {
  let ref
  const focused = useEditorTransaction(() => props._nvrp.editor, editor => isSelcet(editor, props._nvrp.node))
  useMoveable(() => focused() ? ref : void 0, { useResizeObserver: true })
  return <img ref={ref} {...props}  />
}

export const ImageKit = Node.create({
  name: 'image',
  // group: 'block',
  group: 'inline',
  inline: true,
  parseHTML: () => [{ tag: 'img' }],
  addAttributes: () => ({
    src: {},
    style: { default: 'display: block; max-width: 100%', parseHTML: el => `display: block; max-width: 100%; ${el.style.cssText}` },
  }),
  renderHTML: ({ node }) => ['img', { ...node.attrs }],
  addNodeView: () => createNodeView(e => <_Image {...e} />, { syncAttrs: ['src', 'style'] }),
  addCommands() {
    return {
      setImage: (props) => ({ editor, tr, chain }) => {
        const node = this.type.create(props)
        chain().insertContent(node)
        return true
      }
    }
  }
})

export default ImageKit

export const menus = (editor: Editor) => {
  const active = useEditorTransaction(editor, () => (node => node?.type.name == 'image' && isSelcet(editor, node))(editor.state.doc.nodeAt(editor.state.selection.from)))
  const attrs = createMutable({ src: '' })
  const _attrs = useEditorTransaction(editor, () => active() ? { ...editor.getAttributes('image') } : {})
  createEffect(() => Object.assign(attrs, _attrs()))

  const aligns = {
    get left() { return (e => e.includes('margin-right: auto') && !e.includes('margin-left: auto'))(_attrs().style || '') },
    get right() { return (e => e.includes('margin-left: auto') && !e.includes('margin-right: auto'))(_attrs().style || '') },
    get center() { return (e => e.includes('margin-left: auto') && e.includes('margin-right: auto'))(_attrs().style || '') },
    set left(v) { update({ style: `${_attrs().style || ''}; margin-left: unset; margin-right: ${v ? 'auto' : ''};` }) },
    set right(v) { update({ style: `${_attrs().style || ''}; margin-left: ${v ? 'auto' : ''}; margin-right: unset;` }) },
    set center(v) { update({ style: `${_attrs().style || ''}; margin-left: ${v ? 'auto' : 'unset'}; margin-right: ${v ? 'auto' : 'unset'};` }) },
  }

  function ok() {
    editor.chain().setImage(attrs).run()
    editor.commands.setNodeSelection(editor.state.selection.from)
  }

  function update(attrs) {
    editor.chain().updateAttributes('image', attrs).focus().selectNodeForward().run()
    editor.commands.setNodeSelection(editor.state.selection.from)
  }

  return createMemo(() => active() ? [
    { is: () => <input class='pl-2 outline-0 b-0 text-4 op75' autofocus placeholder='https://……' on:keydown={e => e.key == 'Enter' && ok()} use:model={toSignle(attrs, 'src')} /> },
    { icon: () => <ILucideUpload />, cb: () => props.uploadImage().then(src => props.editor.chain().setImage({ src }).focus().run()) },
    { is: 'div', class: 'hr' },
    { icon: () => <ILucideAlignLeft />, isActive: () => aligns.left, cb: () => aligns.left = !aligns.left },
    { icon: () => <ILucideAlignCenter />, isActive: () => aligns.center, cb: () => aligns.center = !aligns.center },
    { icon: () => <ILucideAlignRight />, isActive: () => aligns.right, cb: () => aligns.right = !aligns.right },
  ] : [])
}
