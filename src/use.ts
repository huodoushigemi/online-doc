import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import type { EditorOptions } from '@tiptap/core'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { xx } from './Columns'

export type EditorRef = Editor | ((editor: Editor) => void)

export default function useEditor(props?: () => Partial<EditorOptions>) {
  return createMemo(() => {
    const instance = new Editor({
      ...props?.(),
      extensions: [TextStyleKit, StarterKit, xx]
    })

    onCleanup(() => {
      instance.destroy()
    })

    return instance
  })
}
