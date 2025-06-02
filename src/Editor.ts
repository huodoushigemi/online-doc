import { access, type MaybeAccessor } from "@solid-primitives/utils"
import type { Editor } from "@tiptap/core"
import { createEffect, createSignal, onCleanup } from "solid-js"

export function useEditorTransaction<T>(
  instance: MaybeAccessor<Editor>,
  read: (value: Editor) => T
): () => T {
  const [depend, update] = createSignal(undefined, { equals: false })

  function forceUpdate() {
    update()
  }

  createEffect(() => {
    const editor = access(instance)
    if (editor) {
      editor.on("transaction", forceUpdate)
      onCleanup(() => editor.off("transaction", forceUpdate))
    }
  })

  return () => {
    depend()
    return read(access(instance))
  };
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