import { createMemo, createSignal } from 'solid-js'
import { Editor, isTextSelection, Mark, Node, type Attributes, type MarkViewRendererProps, type NodeViewRendererProps } from '@tiptap/core'
import { createMarkView, createNodeView } from './NodeView'
import { useEditorTransaction } from '../Editor'
import { Popover } from '../components/Popover'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      toggleComment: () => ReturnType
    }
  }
}

const PROPS = {
  text: {
    default: '',
    parseHTML: el => el.getAttribute('text') || ''
  },
  author: {
    default: 'Anonymous',
    parseHTML: el => el.getAttribute('author') || 'Anonymous'
  },
  'created-at': {
    default: new Date().toISOString(),
    parseHTML: el => el.getAttribute('created-at') || new Date().toISOString(),
  },
  'data-type': {
    default: 'comment'
  }
}

type Props = { [K in keyof typeof PROPS]?: string }

function Comment(props: Props & { _nvrp: MarkViewRendererProps }) {
  return <Popover
    trigger='click'
    portal={document.body}
    reference={<span {...props} title={props.text} />}
    floating={<ul class="list bg-base-100 rounded-box shadow-md p-0">
      <li class="list-row">
        <img class="block w-10 h-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp"/>
        <div>
          <div>Dio Lupa</div>
          <div class="text-xs uppercase font-semibold opacity-60">Remaining Reason</div>
        </div>
        <button class="btn btn-square btn-ghost">
          <svg class="w-[1.2em] h-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
        </button>
        <button class="btn btn-square btn-ghost">
          <svg class="w-[1.2em] h-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
        </button>
      </li>
    </ul>}
  />
}

export const CommentKit = Mark.create({
  name: 'comment',
  group: 'inline',
  parseHTML: () => [{ tag: '[data-type="comment"]' }],
  addAttributes: () => PROPS,
  renderHTML: ({ mark }) => ['span', { ...mark.attrs }, 0],
  addMarkView: () => createMarkView(e => <Comment {...e} />, { syncAttrs: Object.keys(PROPS) }),
  addCommands() {
    return {
      toggleComment: () => ({ editor }) => {
        return editor.commands.toggleMark('comment', { text: 'xxx' })
      }
    }
  }
})

export const menus = (editor: Editor) => {
  const isText = useEditorTransaction(editor, editor => isTextSelection(editor.state.selection) && !editor.isActive('codeBlock'))
  const isRange = useEditorTransaction(editor, () => editor.state.selection.from != editor.state.selection.to)

  return createMemo(() => isText() && isRange() ? [
    {
      icon: <span>💬</span>,
      cb: () => editor.commands.toggleComment()
    }
  ] : void 0)
}