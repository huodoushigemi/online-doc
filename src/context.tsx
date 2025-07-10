import { createMemo } from 'solid-js'
import type { ChainedCommands, Editor } from '@tiptap/core'
import { useActive, useEditorTransaction, useNodeAttrs } from './Editor'
import { log, unFn } from './utils'
import { isTextSelection } from '@tiptap/core'
import { LinkPane } from './Floating'

const ColorPane = ({ attrs }) => {
  const colors = ['#fb7185', '#fdba74', '#d9f99d', '#a7f3d0', '#a5f3fc', '#a5b4fc']
  return (
    <div>
      <div class='flex aic gap-1 px-2 mt-1'>
        <input type='color' value={attrs.color} onInput={e => attrs.color = e.target.value} class='p-0! b-0!' />
        <ILucideTrash2 class='li p-1 rd-1' on:click={e => e.stopPropagation() || attrs.color && (attrs.color = void 0)} />
      </div>
      <div class='grid cols-3 gap-2 px-2 py-1'>
        {colors.map(v => <div class='w-4.5 h-4.5' style={{ background: v }} on:click={() => attrs.color = v} />)}
      </div>
    </div>
  )
}

export const menus = (editor: Editor) => {
  const exec = (cb: (chain: ChainedCommands) => ChainedCommands) => cb(editor.chain()).focus().run()

  const ms = Object.values(import.meta.glob('./extensions/*/', { import: 'menus', eager: true })).filter(e => e)

  const aaa = ms.map(e => unFn(e, editor))

  const isText = useEditorTransaction(editor, editor => isTextSelection(editor.state.selection) && !editor.isActive('codeBlock'))
  const isRange = useEditorTransaction(editor, editor => editor.state.selection.from != editor.state.selection.to)

  const style = useEditorTransaction(editor, editor => ({
    get color() { return editor.getAttributes('textStyle').color },
    set color(v) { editor.commands.setColor(v) }
  }))

  return createMemo(() => [
    // 文本
    ...isText() && isRange() ? [
      { icon: () => <ILucideBold />, isActive: useActive(editor, 'bold'), cb: () => exec(chain => chain.toggleBold())  },
      { icon: () => <ILucideUnderline />, isActive: useActive(editor, 'underline'), cb: () => exec(chain => chain.toggleUnderline()) },
      { icon: () => <ILucideItalic />, isActive: useActive(editor, 'italic'), cb: () => exec(chain => chain.toggleItalic()) },
      { icon: () => <ILucideStrikethrough />, isActive: useActive(editor, 'strike'), cb: () => exec(chain => chain.toggleStrike()) },
      { icon: () => <ILucideCode />, isActive: useActive(editor, 'code'), cb: () => exec(chain => chain.toggleCode()) },
      { icon: () => <ILucideLink2 />, isActive: useActive(editor, 'link'), cb: () => exec(e => e.toggleLink({ href: '' })), popover: { portal: document.body, placement: 'top', floating: () => <LinkPane editor={editor} /> } },
      { icon: () => <ILucideHighlighter />, isActive: useActive(editor, 'highlight'), cb: () => exec(e => e.toggleHighlight()) },
      { icon: () => <IMyPaint />, isActive: useActive(editor, 'textStyle'), children: [{ is: ColorPane, get attrs() { return style() } }] },
    ] : [],
    
    // 通用
    // { icon: () => <ILucideLink2 />, isActive: useActive(editor, 'link'), active: () => exec(e => e.toggleLink({ href: '' })), popover: LinkPane },

    // 其他
    ...aaa.map(e => unFn(e) || []).flat()
  ])
}


export const mounted = async (editor: Editor) => {
  const cbs = await Promise.all(Object.values(import.meta.glob('./extensions/*/', { import: 'mounted' }).map(e => e())))
  cbs.forEach(e => e?.(editor))
}