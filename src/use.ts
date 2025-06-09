import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import type { EditorOptions } from '@tiptap/core'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { TableKit } from '@tiptap/extension-table'
import FloatingMenu from '@tiptap/extension-floating-menu'
import { ColExt, xx } from './Columns'
import { Focus, Placeholder, Selection } from '@tiptap/extensions'
import { ListKit } from '@tiptap/extension-list'
import Image from '@tiptap/extension-image'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'

export type EditorRef = Editor | ((editor: Editor) => void)

export default function useEditor(props?: () => Partial<EditorOptions>) {
  return createMemo(() => {
    const instance = new Editor({
      ...props?.(),
      extensions: [
        TextStyleKit,
        StarterKit.configure({
          link: { openOnClick: false },
          // codeBlock: false
        }),
        CodeBlockShiki.configure({ defaultTheme: 'tokyo-night', exitOnArrowDown: false, exitOnTripleEnter: false }),
        // Selection,
        xx,
        ListKit,
        Focus,
        TableKit.configure({
          table: { resizable: true }
        }),
        Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { style: 'max-width: 100%', contenteditable: true } }),
        Placeholder.configure({
          placeholder: 'Type / to browse options',
        }),
        // FloatingMenu.configure({
        //   shouldShow: ({ editor, view, state, oldState }) => {
        //     return editor.isActive('paragraph')
        //   }
        // })
      ]
    })

    onCleanup(() => {
      instance.destroy()
    })

    return instance
  })
}
