import { createRoot, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import { createMutationObserver } from '@solid-primitives/mutation-observer'
import type { MarkViewRenderer, NodeViewRenderer } from '@tiptap/core'
import { isEmpty } from 'es-toolkit/compat';

export function createNodeView(Comp, options?: { syncAttrs?: string[] | Record<string, {}>; contentDOM?(el: HTMLElement): HTMLElement }): NodeViewRenderer {
  return (props) => {
    let root = document.createElement('div')
    const dispose = render(() => {
      let el!: HTMLElement
      if (!isEmpty(options?.syncAttrs)) {
        const attrs = options?.syncAttrs!
        const map = Array.isArray(attrs) ? Object.fromEntries(attrs.map(e => [e, {}])) : attrs
        const ks = Array.isArray(attrs) ? options?.syncAttrs : Object.keys(attrs)
        const sync = () => ks.forEach(k => props.node.attrs[k] = (v => map[k]?.parse?.(v) ?? v ?? props.node.attrs[k])(el.getAttribute(k)))
        onMount(sync)
        createMutationObserver(()  => el, { attributes: true }, () => sync())
      }
      return <Comp ref={el} {...props.HTMLAttributes} _nvrp={props} prop:node_props={props.HTMLAttributes} />
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

export function createMarkView(Comp, options?: { syncAttrs?: string[]; contentDOM?(el: HTMLElement): HTMLElement }): MarkViewRenderer {
  return (props) => {
    return createRoot(destroy => {
      let el!: HTMLElement
      if (options?.syncAttrs?.length) {
        const sync = () => options!.syncAttrs!.forEach(k => props.mark.attrs[k] = el.getAttribute(k))
        onMount(sync)
        createMutationObserver(()  => el, { attributes: true }, () => sync())
      }

      <Comp ref={el} {...props.HTMLAttributes} _nvrp={props} />

      return {
        dom: el,
        get contentDOM() { return options?.contentDOM?.(el) },
        destroy,
        ignoreMutation: () => true,
      }
    })
  }
}

export const menus = []