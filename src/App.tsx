import { For } from 'solid-js'
import 'wc-mdit'
import './App.scss'

import { BubbleMenu, FloatingMenu, ImageBubbleMenu, LinkPane } from './Floating'
import useEditor, { chainReplace, html2md, useActive, useEditorTransaction, } from './Editor'
import type { ChainedCommands } from '@tiptap/core'
import { Dynamic } from 'solid-js/web'
import { chooseImage, file2base64, getStyles, html2docx, print } from './utils'
import { Floating, Popover } from './components/Popover'
import { offset } from 'floating-ui-solid'
import { saveAs } from 'file-saver'
import { VDir } from './hooks/useDir'
import { useDark } from './hooks'
import { Menu } from './components/Menu'

import {  } from 'tiptap-markdown'

const log = (a) => console.log(a)

function App() {
  const [isDark] = useDark()

  const editor = useEditor(() => ({
    content: `
    <div tiptap-is="columns" gap=24>
      <div tiptap-is='column'>1</div>
      <div tiptap-is='column'>2</div>
      <div tiptap-is='column'>3</div>
      <div tiptap-is='column'>4</div>
    </div>
    <p>qweasd</p>
    <a href="xxx">123456</a>
    `
  }))

  window.editor = editor()
  editor().view.dom.classList.add(...'outline-0 flex-1'.split(' '))
  editor().view.dom.classList.add(...`markdown-body max-w-[794px] min-h-[1123px] mx-a! my-20! p10 box-border shadow-lg dark-bg-gray/05`.split(' '))
  editor().view.dom.spellcheck = false
  editor().commands.focus()

  const current = useEditorTransaction(editor, editor => editor.state.selection.$from.node())
  // const active = (k: string, v?: any) => useEditorTransaction(editor, editor => editor.commands.)

  // 清空当前行内容
  function chain() {
    return chainReplace(editor())
  }

  const exec = (cb: (chain: ChainedCommands) => ChainedCommands) => cb(editor().chain()).focus().run()
 
  async function uploadImage() {
    const src = await chooseImage().then(file2base64)
    chain().setImage({ src }).run()
  }

  const getHTML = (css?) => `<div class='markdown-body ${editor().view.dom.className}'>${editor().getHTML()}</div>`

  const nodes = [
    { label: '多列', kw: 'columns', icon: () => <ILucideColumns2 />, cb: () => chain().insertColumns().run() },
    { label: '表格', kw: 'table', icon: () => <ILucideTable />, cb: () => chain().insertTable().run() },
    { label: '图片', kw: 'image', icon: () => <ILucideImage />, cb: () => uploadImage() },
    { label: '文件', kw: 'file', icon: () => <ILucideUpload />, cb: () => alert('敬请期待……') },
    { label: '代码块', kw: 'code', icon: () => <ILucideCode />, cb: () => chain().toggleCodeBlock().run() },
    { label: '引用', kw: 'blockquote', icon: () => <ILucideQuote />, cb: () => chain().toggleBlockquote().run() },
    { label: '分割线', kw: 'hr', icon: () => <ILucideDivide />, cb: () => chain().setHorizontalRule().run() },
    { label: '列表', kw: 'list', icon: () => <ILucideList />, cb: () => chain().toggleBulletList().run() },
    { label: '任务列表', kw: 'todo', icon: () => <ILucideListTodo />, cb: () => chain().toggleTaskList().run() },
    { label: 'Iframe', kw: 'iframe', icon: () => <ILucideAppWindow />, cb: () => chain().insertIframe({ src: 'https://element-plus.org/zh-CN/' }).run() },
  ]

  const marks = [
    { icon: () => <ILucideBold />, isActive: useActive(editor, 'bold'), active: () => exec(chain => chain.toggleBold())  },
    { icon: () => <ILucideUnderline />, isActive: useActive(editor, 'underline'), active: () => exec(chain => chain.toggleUnderline()) },
    { icon: () => <ILucideItalic />, isActive: useActive(editor, 'italic'), active: () => exec(chain => chain.toggleItalic()) },
    { icon: () => <ILucideStrikethrough />, isActive: useActive(editor, 'strike'), active: () => exec(chain => chain.toggleStrike()) },
    { icon: () => <ILucideCode />, isActive: useActive(editor, 'code'), active: () => exec(chain => chain.toggleCode()) },
    { icon: () => <ILucideLink2 />, isActive: useActive(editor, 'link'), active: () => exec(e => e.toggleLink({ href: '' })), popover: LinkPane },
  ]

  return (
    <div class=''>
      <header class='sticky top-0 flex w-full h-12 z-1 bg-[--header-bg]'>
        <div ml-2 class='flex items-center'>
          <img id='logo' src='/vite.svg' />
          <span id='title' ml-2 self-center>在线文档服务</span>
        </div>
        <div id='actions' class='flex aic ml-a self-center mr-2' self-center>
          <Popover
            placement='bottom-end'
            reference={<button class='flex aic bg-blue'>导 出 <ILucideDownload class='ml-1' /></button>}
            floating={() => <Menu class='mt-1 [&_svg]:text-lg ' density='comfortable' items={[
              { label: 'Word', icon: <IVscodeIconsFileTypeWord />, cb: () => html2docx(getHTML()).then(e => saveAs(e, +new Date + '.docx')) },
              { label: 'PDF', icon: <IVscodeIconsFileTypePdf2 />, cb: () => print(getHTML()) },
              { label: 'HTML', icon: <IVscodeIconsFileTypeHtml />, cb: () => saveAs(new File([getHTML(1) + getStyles()], +new Date + '.html')) },
              { label: 'MD', icon: <IVscodeIconsFileTypeMarkdown />, cb: () => html2md(editor().getHTML()).then(e => saveAs(new File([e], +new Date + '.md'))) }]}
            />}
          />
        </div>
      </header>

      <wc-mdit theme={`github-${isDark() ? 'dark' : 'light'}`} no-shadow={true} />

      {/* <Menu class='w-100' items={nodes} /> */}

      {editor().view.dom}

      <FloatingMenu editor={editor()}>
        {search => (
          <Menu
            density='comfortable'
            items={nodes.filter(e => e.label?.includes(search()) || e.kw?.includes(search()))}
            usedir={{ ref: editor().view.dom, defaultFirst: true, options: { capture: true } }}
          />
        )}
      </FloatingMenu>

      <BubbleMenu editor={editor()} shouldShow={({ editor }) => editor.state.selection.from != editor.state.selection.to && !editor.isActive('image')}>
        <div class='menu-x flex aic lh-1em'>
          <For each={marks}>
            {node => {
              return (
                <div class={`li flex aic ${node.isActive() && 'active'} p-1 my-1 rd-2`} onClick={() => node.active()}>
                  <Floating
                    reference={<Dynamic component={node.icon} />}
                    floating={node.popover && node.isActive() ? <node.popover editor={editor()} on:click={e => e.stopPropagation()} /> : void 0}
                    placement='top' middleware={[offset(12)]}
                  />
                </div>
              )
            }}
          </For>
        </div>
      </BubbleMenu>

      <ImageBubbleMenu editor={editor()} uploadImage={() => chooseImage().then(file2base64)} />
    </div>
  )
}

export default App
