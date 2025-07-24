import { onMount } from 'solid-js'
import { customElement, noShadowDOM } from 'solid-element'
import useEditor, { TiptapEditor } from './Editor'

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      'wc-tiptap': Partial<typeof props> & JSX.HTMLAttributes<HTMLDivElement>
    }
  }
}

const props = {
  css: ''
}

customElement('wc-tiptap', props, (props, { element }) => {
  const editor = useEditor()

  Object.defineProperty(element, 'editor', { get: () => editor() })

  onMount(() => element.dispatchEvent(new Event('connected')))

  return (
    <TiptapEditor class='' editor={editor()}>
      <style>{props.css}</style>
    </TiptapEditor>
  )
})
