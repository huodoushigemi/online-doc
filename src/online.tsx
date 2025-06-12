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

render(() => (
  <button class='ml-4 bg-blue' bg-blue style='width: 120px' onClick={ok}>保 存</button>
), document.querySelector('#actions'))
