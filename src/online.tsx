import type { Editor } from '@tiptap/core'
import { render } from 'solid-js/web'

declare const editor: Editor
declare const opener: Window

// call('initialized', null, window)
window.dispatchEvent(new Event('initialized'))

const events = {
  content: e => editor.commands.setContent(e.content),
}

function call(type: string, data?: any, win = opener) {
  win?.postMessage(JSON.stringify(['online-doc', type, data]))
}

window?.addEventListener('message', e => {
  if (e.source == window) return
  const [type, data] = JSON.parse(e.data)
  events[type]?.(data)
})

editor.on('update', () => {
  const content = editor.getHTML()
  call('update', { content })
})

function ok() {
  const content = editor.getHTML()
  call('ok', { content })
}

//
;(async () => {
  const qs = Object.fromEntries(new URLSearchParams(location.search).entries())
  const content = await loadContent(qs)
  content && events.content({ content })
})()

function loadContent(data) {
  return data.content || (data.src ? fetch(data.src, { method: 'GET' }).then(e => e.text()) : '')
}

const view = <header class='sticky top-0 z-1 bg-[--header-bg]' />
document.body.prepend(view)

render(() => (
  <div class='flex h-12'>
    <div ml-2 class='flex items-center'>
      <img src='/vite.svg' />
      <span ml-2 self-center>在线文档服务</span>
    </div>
    <div class='ml-a self-center mr-2' self-center>
      <button class='bg-blue' bg-blue style='width: 120px; line-height: 1.5' onClick={ok}>确 认</button>
    </div>
  </div>
), view)
