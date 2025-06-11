import { onMount } from 'solid-js'
import { render } from 'solid-js/web'
import { createMutationObserver } from '@solid-primitives/mutation-observer'

export function createNodeView(Comp, options?: { syncAttrs?: string[]; contentDOM?(el: HTMLElement): HTMLElement }): NodeViewRenderer {
  return (props) => {
    let root = document.createElement('div')
    // const dispose = render(() => <Comp {...props.HTMLAttributes} tiptapNode={props} />, root)
    const dispose = render(() => {
      let el!: HTMLElement
      if (options?.syncAttrs?.length) {
        const sync = () => options!.syncAttrs!.forEach(k => props.node.attrs[k] = el.getAttribute(k))
        onMount(sync)
        createMutationObserver(()  => el, { attributes: true }, () => {
          options!.syncAttrs!.forEach(k => props.node.attrs[k] = el.getAttribute(k))
        })
      }
      return <Comp ref={el} {...props.HTMLAttributes} />
    }, root)
    const dom = root.firstElementChild! as HTMLElement
    dom.remove()
    root = void 0 as any
    return {
      dom,
      get contentDOM() { return options?.contentDOM?.(dom) },
      destroy: () => dispose(),
      ignoreMutation: () => true,
    }
  }
}