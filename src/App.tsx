import { createEffect, For, createRenderEffect } from 'solid-js'
import './App.scss'

import { html2md, TiptapEditor } from './Editor'
import { chooseImage, file2base64, getStyles, html2docx, print } from './utils'
import { Floating, Popover } from './components/Popover'
import { saveAs } from 'file-saver'
import { useDark, useMemoAsync } from './hooks'
import { Menu } from './components/Menu'
import { Split } from './components/Split'
import { render } from 'solid-js/web'

const log = (a) => console.log(a)

const [isDark, setDark] = useDark()

createRenderEffect(() => {
  document.documentElement.setAttribute('data-theme', isDark() ? 'dark' : 'light')
})

const getHTML = (css?) => `<div class='markdown-body ${css && editor.view.dom.className}' style='${editor.view.dom.style}'>${editor.getHTML()}</div>`

const exports = [
  { label: 'Word', icon: <IVscodeIconsFileTypeWord />, cb: () => html2docx(getHTML()).then(e => saveAs(e, +new Date + '.docx')) },
  { label: 'PDF', icon: <IVscodeIconsFileTypePdf2 />, cb: () => print(getHTML()) },
  { label: 'HTML', icon: <IVscodeIconsFileTypeHtml />, cb: () => saveAs(new File([getHTML(1) + getStyles()], +new Date + '.html')) },
  { label: 'MD', icon: <IVscodeIconsFileTypeMarkdown />, cb: () => html2md(editor.getHTML()).then(e => saveAs(new File([e], +new Date + '.md'))) }
]

function App() {
  return (
    <div class=''>
      <header class='sticky top-0 navbar min-h-0! h-12! z-9 box-border bg-[--header-bg]'>
        <div class='flex items-center'>
          <img id='logo' src='/vite.svg' />
          <span id='title' ml-2 self-center>在线文档服务</span>
        </div>
        <div id='actions' class='flex aic ml-a self-center space-x-4' self-center>
          <button class='btn btn-circle btn-sm' onClick={() => setDark(v => !v)}>
            {isDark() ? <ILucideMoonStar class='text-lg' /> : <ILucideSunMoon class='text-lg'  />}
          </button>
          <Popover
            placement='bottom-end'
            reference={<button class='btn btn-soft btn-sm'>导 出 <ILucideDownload class='ml-1' /></button>}
            floating={() => <Menu class='mt-1 [&_svg]:text-lg ' density='comfortable' items={exports}
            />}
          />
          <div />
        </div>
      </header>

      <TiptapEditor />
    </div>
  )
}

export default App
