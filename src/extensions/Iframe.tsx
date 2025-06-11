import { Node } from '@tiptap/core'
import { createNodeView } from './NodeView'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      insertIframe: (props: { src: string }) => ReturnType
    }
  }
}

export const Iframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  parseHTML: () => [{ tag: 'iframe' }],
  addAttributes: () => ({
    src: {},
    style: { default: 'width: 100%', parseHTML: el => `width: 100%; ${el.style.cssText}` },
  }),
  renderHTML: ({ node }) => ['iframe', { ...node.attrs }],
  addNodeView: () => createNodeView(e => <iframe {...e} />, { syncAttrs: ['src', 'style'] }),
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