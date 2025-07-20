import type { Editor } from '@tiptap/core'
import { useMemoAsync, useSignle2 } from '../hooks'
import { useEditorTransaction } from '../Editor'
import { createEffect, createSignal, splitProps } from 'solid-js'
import { delay } from 'es-toolkit'
import { $Node, Tree } from './Tree'
import { log } from '../utils'

export function DocTree(_: { editor: Editor }) {
  const [props, attrs] = splitProps(_, ['editor'])

  const [count, setCount] = createSignal(0)
  createEffect(() => props.editor.on('update', () => setCount(v => ++v)))

  const json = useMemoAsync(() => (count(), delay(300).then(() => props.editor.getJSON())))
  
  class Node extends $Node {
    // get id() { return this.data.id }
    get label() { return this.data.type }
    getChildren() { return this.data.content?.map(e => new Node(e)) }
  }

  return (
    <div class="doc-tree" {...attrs}>
      {/* <pre>{JSON.stringify(json(), null, 2)}</pre> */}
      <Tree data={json()?.content} Node={Node} class='min-h-40 max-h-100 overflow-auto' />
    </div>
  )
}
