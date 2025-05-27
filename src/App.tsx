import { createSignal, For, mergeProps } from 'solid-js'
import './App.css'

import useEditor from './use'

function App() {
  const editor = useEditor(() => ({
    content: `
    <div tiptap-is="columns" gap=10>
      <div tiptap-is='column'>aaa</div>
      <div tiptap-is='column'>aaa</div>
      <div tiptap-is='column'>aaa</div>
      <div tiptap-is='column'>aaa</div>
    </div>
    `
  }))

  Object.assign(editor().view.dom.style, {
    outline: '0',
    'minHeight': '300px'
  })

  return (
    <>
      {editor().view.dom}
    </>
  )
}

export default App
