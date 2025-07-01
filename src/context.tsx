import { createMemo } from 'solid-js'
import type { ChainedCommands, Editor } from '@tiptap/core'
import { useActive, useEditorTransaction } from './Editor'
import { unFn } from './utils'
import { isTextSelection } from '@tiptap/core'

export const menus = (editor: Editor) => {
  const exec = (cb: (chain: ChainedCommands) => ChainedCommands) => cb(editor.chain()).focus().run()

  const ms = Object.values(import.meta.glob('./extensions/*/', { import: 'menus', eager: true })).filter(e => e)

  const aaa = ms.map(e => unFn(e, editor))

  const isText = useEditorTransaction(editor, editor => isTextSelection(editor.state.selection) && !editor.isActive('codeBlock'))

  return createMemo(() => [
    // 文本
    ...isText() ? [
      { icon: () => <ILucideBold />, isActive: useActive(editor, 'bold'), cb: () => exec(chain => chain.toggleBold())  },
      { icon: () => <ILucideUnderline />, isActive: useActive(editor, 'underline'), cb: () => exec(chain => chain.toggleUnderline()) },
      { icon: () => <ILucideItalic />, isActive: useActive(editor, 'italic'), cb: () => exec(chain => chain.toggleItalic()) },
      { icon: () => <ILucideStrikethrough />, isActive: useActive(editor, 'strike'), cb: () => exec(chain => chain.toggleStrike()) },
      { icon: () => <ILucideCode />, isActive: useActive(editor, 'code'), cb: () => exec(chain => chain.toggleCode()) }
    ] : [],
    
    // 通用
    // { icon: () => <ILucideLink2 />, isActive: useActive(editor, 'link'), active: () => exec(e => e.toggleLink({ href: '' })), popover: LinkPane },
    { icon: () => <ILucideLink2 />, isActive: useActive(editor, 'link'), cb: () => exec(e => e.toggleLink({ href: '' })) },

    // 其他
    ...aaa.map(e => unFn(e)).flat()
  ])
}