import { Node } from '@tiptap/core'
import { createNodeView } from './NodeView'
import { useMoveable } from '../components/Moveable'
import { useEditorTransaction } from '../Editor'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      insertIframe: (props: { src: string }) => ReturnType
    }
  }
}

function _Iframe(props) {
  let ref
  const focused = useEditorTransaction(() => props._nvrp.editor, editor => props._nvrp.node == editor.state.doc.nodeAt(editor.state.selection.$from.pos))
  useMoveable(() => focused() ? ref : void 0, { resizable: { renderDirections: ['n', 's'] } })
  return <iframe ref={ref} {...props} />
}

export const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  parseHTML: () => [{ tag: 'iframe' }],
  addAttributes: () => ({
    src: {},
    style: { default: 'width: 100%; box-sizing: border-box', parseHTML: el => `width: 100%; ${el.style.cssText}` },
  }),
  renderHTML: ({ node }) => ['iframe', { ...node.attrs }],
  addNodeView: () => createNodeView(e => <_Iframe {...e} />, { syncAttrs: ['src', 'style'] }),
  addCommands() {
    return {
      insertIframe: (props) => ({ editor, tr, chain }) => {
        const node = this.type.create(props)
        chain().insertContent(node)
        return true
      }
    }
  }
})