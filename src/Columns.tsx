import { Editor, findChildren, Node, type NodeViewRenderer, type NodeViewRendererProps } from '@tiptap/core'
import { render } from 'solid-js/web'
import { createMutationObserver } from '@solid-primitives/mutation-observer'
import { Columns } from './components/Columns'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      insertColumns: (options?: Partial<{cols: number; gap: number}>) => ReturnType
      addColAfter: (options: { index: number; pos: number }) => ReturnType
    }
  }
}

export const xx = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+',
  // isolating: true,
  // defining: true,
  // atom: true,
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

export const ColExt = Node.create({
  name: 'column',
  // group: 'block',
  content: 'block+',
  // content: 'paragraph block*',
  defining: true,
  // isolating: true,
  atom: true,
  parseHTML: () => [{ tag: '[tiptap-is="column"]' }],
  addAttributes: () => ({
    style: { parseHTML: el => `padding: 12px 0; ${el.style.cssText}` },
    'tiptap-is': { default: 'column' }
  }),
  renderHTML: ({ node }) => ['div', { ...node.attrs }, 0],
  addNodeView: () => createNodeView(El, { syncAttrs: ['style'], contentDOM: el => el }),
})

function createNodeView(Comp, options?: { syncAttrs?: string[]; contentDOM?(el: HTMLElement): HTMLElement; onMount?(el: HTMLElement, props: NodeViewRendererProps): void }): NodeViewRenderer {
  return (props) => {
    let root = document.createElement('div')
    // const dispose = render(() => <Comp {...props.HTMLAttributes} tiptapNode={props} />, root)
    const dispose = render(() => {
      const el = (<Comp {...props.HTMLAttributes} /> as any)() as HTMLElement
      options?.onMount?.(el, props)
      if (options?.syncAttrs?.length) {
        createMutationObserver(el, { attributes: true }, () => {
          options!.syncAttrs!.forEach(k => props.node.attrs[k] = el.getAttribute(k))
        })
      }
      return el
    }, root)
    const dom = root.firstElementChild! as HTMLElement
    dom.remove()
    root = void 0 as any
    return {
      dom,
      get contentDOM() { return options?.contentDOM?.(dom) ?? (dom.classList.contains('is-editable') ? dom : dom.querySelector('.is-editable')) },
      destroy: () => dispose(),
      ignoreMutation: () => true,
    }
  }
}