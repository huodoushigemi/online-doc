import { createEffect, createMemo } from 'solid-js'
import { createMutable } from 'solid-js/store'
import { Editor, Node } from '@tiptap/core'
import { createNodeView } from './NodeView'
import { useMoveable } from '../components/Moveable'
import { useEditorTransaction } from '../Editor'
import { model, toSignle } from '../hooks'

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
  useMoveable(() => focused() ? ref : void 0, { resizable: { renderDirections: ['n', 's'] }, useResizeObserver: true })
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


export const menus = (editor: Editor) => {
  // const active = useActive(editor, 'iframe')
  const active = useEditorTransaction(editor, () => editor.state.doc.nodeAt(editor.state.selection.from)?.type.name == 'iframe' && (editor.state.selection.to - editor.state.selection.from == 1))
  const attrs = createMutable({ src: '' })
  const _attrs = useEditorTransaction(editor, () => active() ? { ...editor.getAttributes('iframe') } : {})
  createEffect(() => Object.assign(attrs, _attrs()))

  function ok() {
    editor.chain().updateAttributes('iframe', attrs).focus().run()
  }

  return createMemo(() => active() ? [
    { is: () => <input class='pl-2 outline-0 b-0 text-4 op75' autofocus placeholder='https://……' on:keydown={e => e.key == 'Enter' && ok()} use:model={toSignle(attrs, 'src')} /> },
  ] : [])
}
