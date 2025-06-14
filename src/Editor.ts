import { access, type MaybeAccessor } from '@solid-primitives/utils'
import { createMemo, createEffect, createSignal, onCleanup } from "solid-js"
import type { EditorOptions } from '@tiptap/core'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { TableKit } from '@tiptap/extension-table'
import { Focus, Placeholder } from '@tiptap/extensions'
import { ListKit } from '@tiptap/extension-list'
import Image from '@tiptap/extension-image'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'
import { useDark } from "./hooks"
import { ColumnsKit } from './extensions/Columns'
import { Iframe } from "./extensions/Iframe"

export function useEditorTransaction<T>(
  instance: MaybeAccessor<Editor>,
  read: (value: Editor) => T
): () => T {
  const [depend, update] = createSignal(undefined, { equals: false })

  createEffect(() => {
    const editor = access(instance)
    if (editor) {
      editor.on("transaction", update)
      onCleanup(() => editor.off("transaction", update))
    }
  })

  return createMemo(() => {
    depend()
    return read(access(instance))
  })
}

export function chainReplace(editor: Editor) {
  return editor.chain().command(({ tr, state }) => {
    const { $from, $to } = state.selection
    if ($from.pos == $to.pos) {
      const nodePos = $from.pos - $from.parentOffset
      tr.delete(nodePos, $to.pos)
    } else {
      tr.delete($from.pos, $to.pos - 1)
      // tr.deleteSelection()
    }
    return true
  }).focus()
}

export function useActive(editor: MaybeAccessor<Editor>, key: string) {
  return useEditorTransaction(editor, editor => editor.isActive(key))
}

export type EditorRef = Editor | ((editor: Editor) => void)

export default function useEditor(props?: () => Partial<EditorOptions>) {
  const [isDark] = useDark()
  return createMemo(() => {
    const instance = tiptap(props?.(), isDark())

    onCleanup(() => {
      instance.destroy()
    })

    return instance
  })
}


function tiptap(props?: Partial<EditorOptions>, isDark?: boolean) {
  return new Editor({
    ...props,
    extensions: [
      TextStyleKit,
      StarterKit.configure({
        link: { openOnClick: false },
        codeBlock: false,
      }),
      CodeBlockShiki.configure({ defaultTheme: `github-${isDark ? 'dark' : 'light'}`, exitOnArrowDown: false, exitOnTripleEnter: false }),
      // Selection,
      ColumnsKit,
      Iframe,
      ListKit.configure({
        bulletList: false,
        listItem: false,
        orderedList: false,
        listKeymap: false,
      }),
      Focus,
      TableKit.configure({
        table: { resizable: true, cellMinWidth: 50 },
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
      ...props?.extensions ?? []
    ]
  })
}

export async function html2md(html: string) {
  const { Markdown } = await import('tiptap-markdown')
  const editor = tiptap({ extensions: [Markdown] })
  editor.commands.setContent(html)
  const ret = editor.storage.markdown.getMarkdown()
  editor.destroy()
  return ret
}