import { createSignal, For, mergeProps } from 'solid-js'
import './App.scss'

import useEditor from './use'
import { Columns } from './Columns'

function App() {
  const editor = useEditor(() => ({
    content: `
    <div tiptap-is="columns" gap=10>
      <div tiptap-is='column'>1</div>
      <div tiptap-is='column'>2</div>
      <div tiptap-is='column'>3</div>
      <div tiptap-is='column'>4</div>
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
      <br />
      <Columns />
    </>
  )
}

export default App
