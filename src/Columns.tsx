import { Node } from '@tiptap/core'
import { createSignal, For, mergeProps } from 'solid-js'
import { createMutationObserver } from '@solid-primitives/mutation-observer'

const log = (v, ...arg) => (console.log(v, ...arg), v)

const Columns = (props: Partial<{ cols: number, gap: number }>) => {
  props = mergeProps({ cols: 2, gap: 32 }, props)

  const [cols, setCols] = createSignal(0)
  let ref!: HTMLElement
  createMutationObserver(() => ref, { childList: true, subtree: false, attributes: false }, () => {
    log('xxx')
    setCols(log(ref.querySelectorAll('& > [tiptap-is="column"]').length))
  })

  return (
    <div ref={ref} style={`display: flex; gap: ${props.gap}px`} tiptap-is='columns' {...props} cols={cols()} />
  )
}

const Col = () => {
  return (
    <div style={`flex: 1 0; background: rgba(0,0,0,.1); min-height: 1.5em`} tiptap-is='column'></div>
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
  renderHTML: ({ HTMLAttributes }) => (dom => ({ dom, contentDOM: dom }))(log(Columns(HTMLAttributes))),
  // renderHTML: ({ HTMLAttributes }) => ['div', { 'tiptap-is': 'columns' }, 0],
  // addNodeView: () => ({ HTMLAttributes, node }) => (dom => ({ dom, contentDOM: dom }))(log(Columns(HTMLAttributes))),
  addExtensions: () => [ColExt]
})

export const ColExt = Node.create({
  name: 'column',
  group: 'block',
  content: 'paragraph block*',
  defining: true,
  parseHTML: () => [{ tag: '[tiptap-is="column"]' }],
  renderHTML: () => (dom => ({ dom, contentDOM: dom }))(Col()),
  // addNodeView: () => () => (dom => ({ dom, contentDOM: dom }))(log(Col())),
})