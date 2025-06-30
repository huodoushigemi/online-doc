import { createEffect, onCleanup } from 'solid-js'
import { Node } from '@tiptap/core'
import { createNodeView } from './NodeView'
import Moveable from 'moveable'
import { useEditorTransaction } from '../Editor'
import { useMoveable } from '../components/Moveable'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (props: { src: string; style?: string }) => ReturnType
    }
  }
}

function _Image(props) {
  let ref
  const focused = useEditorTransaction(() => props._nvrp.editor, editor => props._nvrp.node == editor.state.doc.nodeAt(editor.state.selection.$from.pos))
  useMoveable(() => focused() ? ref : void 0)
  return <img ref={ref} {...props}  />
}

export const ImageKit = Node.create({
  name: 'image',
  group: 'block',
  atom: true,
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