import { createComponent, createContext, createRoot, createSignal, For, mergeProps, onCleanup, onMount, useContext } from 'solid-js'
import { createMutable } from 'solid-js/store'
import { Node, type NodeViewRenderer } from '@tiptap/core'
import { createMutationObserver } from '@solid-primitives/mutation-observer'
import { insert, render } from 'solid-js/web'
import { Fragment } from 'solid-js/h/jsx-runtime'

const log = (v, ...arg) => (console.log(v, ...arg), v)


export const Columns = (props: Partial<{ gap: number }>) => {
  props = mergeProps({ gap: 32 }, props)

  const [cols, setCols] = createSignal(0)

  let ref!: HTMLElement
  
  const updateCols = () => setCols(ref?.querySelectorAll('& > [tiptap-is="column"]').length)
  onMount(() => updateCols())
  createMutationObserver(() => ref, { childList: true, subtree: false }, () => updateCols())
  
  return (
    // gap: ${props.gap}px
    <div ref={ref} class='is-editable' style={`display: flex; --cols: ${cols()}; --gap: ${props.gap}px`} tiptap-is='columns' cols={cols()} />
  )
}

const Col = () => {
  const col = <div class='is-editable' style={`flex: 1 0; background: rgba(0,0,0,.1); min-height: 1.5em`} tiptap-is='column' /> as HTMLElement
  Promise.resolve().then(() => col.after(Hand()))
  return col
}

const Hand = () => {
  return (
    <div class='col-hand' contenteditable='false'> </div>
  )
}

export const xx = Node.create({
  name: 'columns',
  group: 'block',
  // priority: 0,
  // isolating: true,
  content: 'column+',
  defining: true,
  // addOptions: () => ({  }),
  parseHTML: () => [{ tag: '[tiptap-is="columns"]' }],
  addAttributes: () => ({
    // cols: { parseHTML: el => el.querySelectorAll('& > [tiptap-is="column"]').length },
    gap: { parseHTML: el => el.getAttribute('gap') },
  }),
  // renderHTML: ({ HTMLAttributes }) => Columns(HTMLAttributes),
  // renderHTML: ({ HTMLAttributes }) => (dom => ({ dom, contentDOM: dom }))(log(Columns(HTMLAttributes), 'render')),
  renderHTML: ({ HTMLAttributes }) => ['div', { 'tiptap-is': 'columns', ...HTMLAttributes }, 0],
  // addNodeView: () => ({ HTMLAttributes, node }) => (dom => ({ dom, contentDOM: dom }))(log(Columns(HTMLAttributes), 'addnode')),
  addNodeView: () => createNodeView(Columns),
  addExtensions: () => [ColExt]
})

export const ColExt = Node.create({
  name: 'column',
  group: 'block',
  content: 'paragraph block*',
  defining: true,
  parseHTML: () => [{ tag: '[tiptap-is="column"]' }],
  // renderHTML: () => (dom => ({ dom, contentDOM: dom }))(Col()),
  renderHTML: ({ HTMLAttributes }) => ['div', { 'tiptap-is': 'col', ...HTMLAttributes }],
  addNodeView: () => createNodeView(Col),
})

function createNodeView(Comp): NodeViewRenderer {
  return ({ HTMLAttributes }) => {
    let root = document.createElement('div')
    const dispose = render(() => <Comp {...HTMLAttributes} />, root)
    const dom = root.firstElementChild!
    dom.remove()
    root = void 0 as any
    // const [dom, dispose] = createRoot(dis => [Comp(HTMLAttributes), dis])
    return {
      dom,
      get contentDOM() { return dom.classList.contains('is-editable') ? dom : dom.querySelector('.is-editable') },
      destroy: () => dispose(),
      // update: () => log(111),
      ignoreMutation: () => true
    }
  }
}