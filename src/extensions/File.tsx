import { Editor, findParentNodeClosestToPos, isTextSelection, Mark, Node, type Attributes, type MarkViewRendererProps, type NodeViewRendererProps } from '@tiptap/core'
import { createNodeView, createMarkView } from './NodeView'
import { useEditorTransaction, useNodeAttrs } from '../Editor'
import { createMemo } from 'solid-js'
import { useMemoAsync } from '../hooks'
import { file2base64, log } from '../utils'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    file: {
      insertFile: (opts: { src?: string; file?: File }) => ReturnType
    }
  }
}

const PROPS = {
  src: { default: '', parseHTML: el => el.getAttribute('src') || '' },
  file: { default: '', parse: true },
  'data-type': { default: 'file' }
}

type Props = { [K in keyof typeof PROPS]?: any }

function MyFile(props: Props & { _nvrp: NodeViewRendererProps }) {
  return (
    <span
      {...props}
      file={(file => JSON.stringify({ name: file.name, size: file.size, type: file.type }))(props.file || {} as File)}
    >
      📄{props.file?.name ?? props.src}
    </span>
  )
}

export const FileKit = Node.create({
  name: 'file',
  group: 'inline',
  inline: true,
  parseHTML: () => [{ tag: '[data-type="file"]' }],
  addAttributes: () => PROPS,
  renderHTML: ({ node }) => ['span', { ...node.attrs }, 0],
  addNodeView: () => createNodeView(MyFile, { syncAttrs: PROPS }),
  addCommands() {
    return {
      insertFile: (props) => ({ editor, tr, chain }) => {
        const node = this.type.create(props)
        chain().insertContent(node)
        return true
      }
    }
  }
})

export default FileKit

// 选择 file 节点时，显示菜单
export const menus = (editor: Editor) => {
  const node = useEditorTransaction(editor, () => findParentNodeClosestToPos(editor.state.selection.$from, node => node.type.name == 'file')?.node)
  const attrs = createMemo(() => node() ? useNodeAttrs(editor, node())() : void 0)

  return createMemo(() => attrs() ? [
    { label: '打开文件', cb: () => window.open(attrs()?.src) }
  ] : void 0)
}