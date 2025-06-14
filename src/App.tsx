import { createEffect, For } from 'solid-js'
import './App.scss'

import { BubbleMenu, FloatingMenu, ImageBubbleMenu, LinkPane } from './Floating'
import useEditor, { chainReplace, html2md, useActive, useEditorTransaction, } from './Editor'
import type { ChainedCommands } from '@tiptap/core'
import { Dynamic, Portal } from 'solid-js/web'
import { chooseImage, file2base64, getStyles, html2docx, print } from './utils'
import { Floating, Popover } from './components/Popover'
import { offset } from 'floating-ui-solid'
import { saveAs } from 'file-saver'
import { VDir } from './hooks/useDir'
import { useDark, useMemoAsync } from './hooks'
import { Menu } from './components/Menu'

const log = (a) => console.log(a)

const [isDark] = useDark()
const theme = useMemoAsync(() => isDark()
  ? import('wc-mdit/dist/theme/github-dark.css?raw').then(e => e.default)
  : import('wc-mdit/dist/theme/github-light.css?raw').then(e => e.default)
)

function App() {

  const editor = useEditor(() => ({
    content: `<h1>wc-mdit</h1><p>A markdown-to-html web component.</p><h2>⚙️ Installation</h2><ul><li><p>npm</p></li></ul><pre><code>npm i wc-mdit</code></pre><ul><li><p>scripts</p></li></ul><pre><code>&lt;script src="https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js"&gt;&lt;/script&gt;\n&lt;script src="https://cdn.jsdelivr.net/npm/wc-mdit/dist/wc-mdit.umd.js"&gt;&lt;/script&gt;</code></pre><h2>🚀 Example</h2><pre><code>import 'wc-mdit'\n\nfunction App() {\n  return (\n    &lt;wc-mdit content='# H1' theme='github-dark' /&gt;\n    // or\n    &lt;wc-mdit src="https://raw.githubusercontent.com/huodoushigemi/wc-mdit/refs/heads/main/README.md" theme='github-dark' /&gt;\n  )\n}</code></pre><h2>📄 Props</h2><table style="min-width: 150px"><colgroup><col style="min-width: 50px"><col style="min-width: 50px"><col style="min-width: 50px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Attribute</p></th><th colspan="1" rowspan="1"><p>Type</p></th><th colspan="1" rowspan="1"><p>Description</p></th></tr><tr><td colspan="1" rowspan="1"><p>src</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p>URL to external markdown file.</p></td></tr><tr><td colspan="1" rowspan="1"><p>content</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p></p></td></tr><tr><td colspan="1" rowspan="1"><p>theme</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p></p></td></tr><tr><td colspan="1" rowspan="1"><p>css</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p><code>&lt;style&gt;{css}&lt;/style&gt;</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>no-shadow</p></td><td colspan="1" rowspan="1"><p>Boolean</p></td><td colspan="1" rowspan="1"><p>If set, renders and stamps into <strong>light DOM</strong> instead. Please know what you are doing.</p></td></tr><tr><td colspan="1" rowspan="1"><p>body-class</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p>Class names forwarded to <code>.markdown-body</code> block.</p></td></tr><tr><td colspan="1" rowspan="1"><p>body-style</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p>Style forwarded to <code>.markdown-body</code> block.</p></td></tr><tr><td colspan="1" rowspan="1"><p>options</p></td><td colspan="1" rowspan="1"><p>Object</p></td><td colspan="1" rowspan="1"><p><code>new MarkdownIt(options)</code></p></td></tr></tbody></table><p></p>`
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

  const getHTML = (css?) => `<div class='markdown-body ${css && editor().view.dom.className}' style='${editor().view.dom.style}'>${editor().getHTML()}</div>`

  const nodes = [
    { label: '多列', kw: 'columns', icon: () => <ILucideColumns2 />, cb: () => chain().insertColumns().run() },
    { label: '表格', kw: 'table', icon: () => <ILucideTable />, cb: () => chain().insertTable().run() },
    { label: '图片', kw: 'image', icon: () => <ILucideImage />, cb: () => uploadImage() },
    { label: '文件', kw: 'file', 'attr:disabled': true, icon: () => <ILucideUpload />, cb: () => alert('敬请期待……') },
    { label: '代码块', kw: 'code', icon: () => <ILucideCode />, cb: () => chain().toggleCodeBlock().run() },
    { label: '引用', kw: 'blockquote', icon: () => <ILucideQuote />, cb: () => chain().toggleBlockquote().run() },
    { label: '分割线', kw: 'hr', icon: () => <ILucideDivide />, cb: () => chain().setHorizontalRule().run() },
    { label: '列表', kw: 'list', icon: () => <ILucideList />, cb: () => chain().toggleBulletList().run() },
    { label: '任务列表', kw: 'todo', icon: () => <ILucideListTodo />, cb: () => chain().toggleTaskList().run() },
    { label: 'Iframe', kw: 'iframe', icon: () => <ILucideAppWindow />, cb: () => chain().insertIframe({ src: 'https://element-plus.org/zh-CN/' }).run() },
    { label: '表单', kw: 'form', 'attr:disabled': true, icon: () => <IMyForms />, cb: () => alert('敬请期待……') },
  ]

  const marks = [
    { icon: () => <ILucideBold />, isActive: useActive(editor, 'bold'), active: () => exec(chain => chain.toggleBold())  },
    { icon: () => <ILucideUnderline />, isActive: useActive(editor, 'underline'), active: () => exec(chain => chain.toggleUnderline()) },
    { icon: () => <ILucideItalic />, isActive: useActive(editor, 'italic'), active: () => exec(chain => chain.toggleItalic()) },
    { icon: () => <ILucideStrikethrough />, isActive: useActive(editor, 'strike'), active: () => exec(chain => chain.toggleStrike()) },
    { icon: () => <ILucideCode />, isActive: useActive(editor, 'code'), active: () => exec(chain => chain.toggleCode()) },
    { icon: () => <ILucideLink2 />, isActive: useActive(editor, 'link'), active: () => exec(e => e.toggleLink({ href: '' })), popover: LinkPane },
  ]

  const exports = [
    { label: 'Word', icon: <IVscodeIconsFileTypeWord />, cb: () => html2docx(getHTML()).then(e => saveAs(e, +new Date + '.docx')) },
    { label: 'PDF', icon: <IVscodeIconsFileTypePdf2 />, cb: () => print(getHTML()) },
    { label: 'HTML', icon: <IVscodeIconsFileTypeHtml />, cb: () => saveAs(new File([getHTML(1) + getStyles()], +new Date + '.html')) },
    { label: 'MD', icon: <IVscodeIconsFileTypeMarkdown />, cb: () => html2md(editor().getHTML()).then(e => saveAs(new File([e], +new Date + '.md'))) }
  ]

  return (
    <div class=''>
      <header class='sticky top-0 navbar min-h-0! h-12! z-9 box-border bg-[--header-bg]'>
        <div class='flex items-center'>
          <img id='logo' src='/vite.svg' />
          <span id='title' ml-2 self-center>在线文档服务</span>
        </div>
        <div id='actions' class='flex aic ml-a self-center' self-center>
          <Popover
            placement='bottom-end'
            reference={<button class='btn btn-soft btn-sm'>导 出 <ILucideDownload class='ml-1' /></button>}
            floating={() => <Menu class='mt-1 [&_svg]:text-lg ' density='comfortable' items={exports}
            />}
          />
        </div>
      </header>

      {/* 编辑区域 */}
      {/* <Portal useShadow={true}> */}
        {editor().view.dom}
        <style>{/*@once*/ useMemoAsync(() => import('./tiptap.scss?url').then(e => fetch(e.default, { method: 'GET' }).then(e => e.text()))) as unknown as string}</style>
        <style>{/*@once*/ useMemoAsync(() => (isDark() ? import('wc-mdit/dist/theme/github-dark.css?raw') : import('wc-mdit/dist/theme/github-light.css?raw')).then(e => e.default)) as unknown as string}</style>
      {/* </Portal> */}

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
        <div class='tt-menu-x flex aic lh-1em'>
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
