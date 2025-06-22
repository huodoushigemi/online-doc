import { createEffect, For, createRenderEffect } from 'solid-js'
import './App.scss'

import { BubbleMenu, FloatingMenu, ImageBubbleMenu, LinkPane } from './Floating'
import useEditor, { chainReplace, html2md, useActive, useEditorTransaction, TiptapEditor } from './Editor'
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

const [isDark, setDark] = useDark()
const theme = useMemoAsync(() => isDark()
  ? import('wc-mdit/dist/theme/github-dark.css?raw').then(e => e.default)
  : import('wc-mdit/dist/theme/github-light.css?raw').then(e => e.default)
)

createRenderEffect(() => {
  document.documentElement.setAttribute('data-theme', isDark() ? 'dark' : 'light')
})

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
