# 自定义 Tiptap 扩展

该目录用于自定义 Tiptap 扩展

## 示例：自定义 文件节点

```tsx
import { Editor, isTextSelection, Mark, Node, type Attributes, type MarkViewRendererProps, type NodeViewRendererProps } from '@tiptap/core'
import { createNodeView, createMarkView } from './NodeView'
import { useEditorTransaction, useNodeAttrs } from '../Editor'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    file: {
      insertFile: (opts: { src: string }) => ReturnType
    }
  }
}

const PROPS = {
  src: { default: '', parseHTML: el => el.getAttribute('src') || '' },
  'data-type': { default: 'file' }
}

type Props = { [K in keyof typeof PROPS]?: string }

function MyFile(props: Props & { _nvrp: NodeViewRendererProps }) {
  return <span {...props}>{props.src}</span>
}

export const FileKit = Node.create({
  name: 'file',
  group: 'inline',
  parseHTML: () => [{ tag: '[data-type="file"]' }],
  addAttributes: () => PROPS,
  renderHTML: ({ node }) => ['span', { ...node.attrs }, 0],
  addNodeView: () => createNodeView(MyFile, { syncAttrs: Object.keys(PROPS) }),
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
```
