import { batch, createComponent, createContext, createEffect, createMemo, createRoot, createSignal, For, getOwner, mergeProps, onCleanup, onMount, useContext } from 'solid-js'
import { createMutable } from 'solid-js/store'
import { Editor, Node, type NodeViewRenderer, type NodeViewRendererProps } from '@tiptap/core'
import { render } from 'solid-js/web'
import { createPointerListeners } from '@solid-primitives/pointer'
import { createMutationObserver } from '@solid-primitives/mutation-observer'
import { createElementSize } from '@solid-primitives/resize-observer'
import { createElementBounds } from '@solid-primitives/bounds'
import { clamp, sum } from 'es-toolkit'
import { usePointerDrag } from './hooks'

const log = (v, ...arg) => (console.log(v, ...arg), v)

export const Columns = (props: Partial<{ gap: number }>) => {
  const [cols, setCols] = createSignal(0)

  let ref!: HTMLElement

  const [children, setChildren] = createSignal<HTMLElement[]>([])
  
  const updateCols = () => setCols(ref?.querySelectorAll('& > [tiptap-is="column"]').length)
  onMount(() => updateCols())
  createMutationObserver(() => ref, { childList: true }, () => {
    setChildren([...ref!.querySelectorAll('& > [tiptap-is="column"]')])
  })

  // const wm = new WeakMap()
  const container = <div style='position: absolute; z-index: 1'></div> as HTMLElement
  const bounds = createElementBounds(() => ref, { trackScroll: false })
  const bounds2 = createElementBounds(() => ref, { trackScroll: false })
  createEffect(() => {
    ref.insertBefore(container, ref.firstChild)
    onCleanup(() => container.remove())
  })

  createEffect(() => {
    const cw = ref.offsetWidth
    const ws = []
    children().forEach(el => {
      // wm.set(el, )
      const dispose = render(() => <Hand2 gap={props.gap || 0} reference={el} prev={el} next={el.after()} bounds={bounds} bounds2={bounds2} />, container)
      onCleanup(dispose)
      ws.push(el.style.width ? el.offsetWidth : void 0)
    })
    const remainw = cw - sum(ws.filter(w => w != null)) - ((cols() - 1) * (props.gap || 0))
    const sss = ws.filter(e => e == null)
    ws.forEach((w, i) => {
      children()[i].style.width = `${remainw / sss.length}px`
    })
  })
  
  return (
    <div ref={ref} class='is-editable' style={`display: flex; gap: ${props.gap}px; --cols: ${cols()}; --gap: ${props.gap}px;`} gap={props.gap} tiptap-is='columns' cols={cols()}>
      {props.children}
    </div>
  )
}

const Col = (props) => {
  const state = createMutable({ cols: 0, gap: 0, last: false })

  let col: HTMLElement, hand: HTMLElement
  
  // queueMicrotask(() => hand && col.after(hand))

  const update = () => batch(() => {
    const parent = col.parentElement!
    state.cols = +parent.getAttribute('cols')! || 0
    state.gap = +parent.getAttribute('gap')! || 0
    state.last = parent.lastElementChild == hand || parent.lastElementChild == col
    state.last && hand.remove()
  })

  createMutationObserver(() => col.parentElement!, { attributes: true }, update)  
  createMutationObserver(() => col.parentElement!, { childList: true }, update)

  // onMount(update)
  queueMicrotask(update)

  return (
    <div ref={col} class='' style={`flex: 0 0 auto; width: calc(${1 / state.cols * 100}% - ${(state.cols - 1) * state.gap / state.cols}px); min-height: 1.5em ${props.style}`} tiptap-is='column'>
      <div class='is-editable' />
      <Hand ref={v => hand = v} {...props} />
    </div>
  )
}

const Hand = (props) => {
  const addCol = (e: MouseEvent) => {
    e.stopPropagation()
    props.onAdd?.()
  }

  let el: HTMLElement
  usePointerDrag(() => el, {
    start(e, move) {
      const col = props.reference!
      const container = col.parentElement!, cw = container.offsetWidth
      const [cols, gap] = [+container.getAttribute('cols')!, +container.getAttribute('gap')!]
      const [left, right] = [col, col.nextElementSibling as HTMLElement]
      const [lw, rw] = [left?.offsetWidth || 0, right?.offsetWidth || 0]
      const minw = cw * .05, maxw = lw + rw - minw
      const reduce = (cols - 1) * gap / cols

      move((e, { ox }) => {
        left && (left.style.width = `calc(${(clamp(lw + ox, minw, maxw) + reduce) / cw * 100}% - ${reduce}px)`)
        right && (right.style.width = `calc(${(clamp(rw - ox, minw, maxw) + reduce) / cw * 100}% - ${reduce}px)`)
      })
    },
  })
  
  return (
    <div ref={el} ref={props.ref} class='col-hand' contenteditable='false'>
      <div class='dot' onClick={addCol} on:pointerdown={{ handleEvent: e => e.stopPropagation() }} />
      {/* <div class='hand'></div> */}
    </div>
  )
}

const Hand2 = (props) => {
  const addCol = (e: MouseEvent) => {
    e.stopPropagation()
    props.onAdd?.()
  }

  const bounds = createElementBounds(props.reference, { trackMutation: false, trackResize: false })
  
  const style = createMemo(() => (`
    position: absolute;
    width: ${props.gap}px;
    transform: translate(${bounds.right - props.bounds2.left}px, ${bounds.top - props.bounds2.top}px);
    height: ${bounds.height}px;
  `))

  let el: HTMLElement
  usePointerDrag(() => el, {
    start(e, move) {
      const col = props.reference!
      const container = col.parentElement!, cw = container.offsetWidth
      const [cols, gap] = [+container.getAttribute('cols')!, +container.getAttribute('gap')!]
      const [left, right] = [col, col.nextElementSibling as HTMLElement]
      const [lw, rw] = [left?.offsetWidth || 0, right?.offsetWidth || 0]
      const minw = cw * .05, maxw = lw + rw - minw
      const reduce = (cols - 1) * gap / cols

      move((e, { ox }) => {
        left && (left.style.width = `calc(${(clamp(lw + ox, minw, maxw) + reduce) / cw * 100}% - ${reduce}px)`)
        right && (right.style.width = `calc(${(clamp(rw - ox, minw, maxw) + reduce) / cw * 100}% - ${reduce}px)`)
      })
    },
  })
  
  return (
    <div ref={el} ref={props.ref} class='col-hand' style={style()} contenteditable='false'>
      <div class='dot' onClick={addCol} on:pointerdown={{ handleEvent: e => e.stopPropagation() }} />
      {/* <div class='hand'></div> */}
    </div>
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
    gap: { parseHTML: el => el.getAttribute('gap') ? +el.getAttribute('gap')! : 24 },
  }),
  renderHTML: ({ node }) => ['div', { 'tiptap-is': 'columns', ...node.attrs }, 0],
  addNodeView: () => createNodeView(Columns, { syncAttrs: ['style'] }),
  addExtensions: () => [ColExt]
})

export const ColExt = Node.create({
  name: 'column',
  group: 'block',
  content: 'block*',
  defining: true,
  parseHTML: () => [{ tag: '[tiptap-is="column"]' }],
  addOptions: () => ({ xxx: 11 }),
  addAttributes: () => ({
    style: { parseHTML: el => el.style.cssText },
  }),
  // renderHTML: () => (dom => ({ dom, contentDOM: dom }))(Col()),
  renderHTML: ({ node }) => ['div', { 'tiptap-is': 'col', ...node.attrs }, 0],
  addNodeView: () => createNodeView(Col, { syncAttrs: ['style'] }),
  addCommands: () => ({
    // setCol: (attrs) => ({ editor }) => { editor.chain().updateAttributes('column', attrs).run() },
    // addCol: () => ({ editor }) => editor.chain().updateAttributes('column', attrs).run()
  }),
  onCreate(event) {
    
  },
})

function createNodeView(Comp, options?: { syncAttrs?: string[], onMount?(el: HTMLElement, props: NodeViewRendererProps): void }): NodeViewRenderer {
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
    const dom = root.firstElementChild!
    dom.remove()
    root = void 0 as any
    // const [dom, dispose] = createRoot(dis => [Comp(HTMLAttributes), dis])
    // dom._tiptap_NodeViewRendererProps = props
    // cb?.(dom, props)
    return {
      dom,
      get contentDOM() { return dom.classList.contains('is-editable') ? dom : dom.querySelector('.is-editable') },
      destroy: () => dispose(),
      ignoreMutation: () => true,
    }
  }
}