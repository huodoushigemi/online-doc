import { children, createEffect, createSignal, For, mergeProps, onCleanup, onMount } from 'solid-js'
import './App.scss'

import useEditor from './use'
import { Columns } from './Columns'
import { BubbleMenu, FloatingMenu, ImageBubbleMenu, LinkPane } from './Floating'
import { chainReplace, useActive, useEditorTransaction, } from './Editor'
import type { CommandProps, ChainedCommands } from '@tiptap/core'
import { Dynamic, Portal } from 'solid-js/web'
import { chooseImage, file2base64 } from './utils'
import { Popover } from './components/Popover'
import { autoUpdate, createFloating, flip, hide, offset } from 'floating-ui-solid'

const log = (a) => console.log(a)

function App() {
  const editor = useEditor(() => ({
    content: `
    <p>qweasd</p>
    <img src="http://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" />

    <a href="xxx">123456</a>
    `
    // <div tiptap-is="columns">
    //   <div tiptap-is='column'>1</div>
    //   <div tiptap-is='column'>2</div>
    //   <div tiptap-is='column'>3</div>
    //   <div tiptap-is='column'>4</div>
    // </div>
  }))

  // editor().commands.setNodeSelection

  window.editor = editor()
  editor().view.dom.classList.add(...'outline-0 flex-1'.split(' '))

  const search = useEditorTransaction(editor, editor => (s => s[0] == '/' ? s.slice(1) : '')(editor.state.selection.$from.node().textContent))

  const current = useEditorTransaction(editor, editor => editor.state.selection.$from.node())
  // const active = (k: string, v?: any) => useEditorTransaction(editor, editor => editor.commands.)

  // 清空当前行内容
  function chain() {
    return chainReplace(editor())
  }

  const exec = (cb: (chain: ChainedCommands) => ChainedCommands) => cb(editor().chain()).focus().run()

  // const asd = useEditorTransaction(editor, editor => console.log(...(v => [v.pos, v.parentOffset])(editor.state.selection.$from)))
  createEffect(() => {
    // asd()
    // editor().isActive('image')
    // console.log(current().type)
    // useActive('image')()
    console.log(editor().state.selection)
  })
 
  async function uploadImage() {
    const src = await chooseImage().then(file2base64)
    chain().setImage({ src }).run()
  }

  onCleanup(() => console.log('cleanup'))

  const nodes = [
    { label: '多列', kw: 'columns', icon: () => <ILucideColumns2 />, cb: () => editor().commands.insertColumns() },
    { label: '表格', kw: 'table', icon: () => <ILucideTable />, cb: () => chain().insertTable().run() },
    { label: '图片', kw: 'image', icon: () => <ILucideImage />, cb: () => uploadImage() },
    // { label: '图片', kw: 'image', icon: () => <ILucideImage />, cb: () => exec(chain => chain) },
    { label: '代码块', kw: 'code', icon: () => <ILucideCode />, cb: () => chain().toggleCodeBlock().run() },
    { label: '引用', kw: 'blockquote', icon: () => <ILucideQuote />, cb: () => chain().toggleBlockquote().run() },
    { label: '分割线', kw: 'hr', icon: () => <ILucideDivide />, cb: () => chain().setHorizontalRule().run() },
    { label: '列表', kw: 'ul', icon: () => <ILucideList />, cb: () => chain().toggleBulletList().run() },
    { label: '任务列表', kw: 'taskList', icon: () => <ILucideListTodo />, cb: () => chain().toggleTaskList().run() },
  ]

  const marks = [
    { icon: () => <ILucideBold />, isActive: useActive(editor, 'bold'), active: () => exec(chain => chain.toggleBold())  },
    { icon: () => <ILucideUnderline />, isActive: useActive(editor, 'underline'), active: () => exec(chain => chain.toggleUnderline()) },
    { icon: () => <ILucideItalic />, isActive: useActive(editor, 'italic'), active: () => exec(chain => chain.toggleItalic()) },
    { icon: () => <ILucideStrikethrough />, isActive: useActive(editor, 'strike'), active: () => exec(chain => chain.toggleStrike()) },
    { icon: () => <ILucideCode />, isActive: useActive(editor, 'code'), active: () => exec(chain => chain.toggleCode()) },
    { icon: () => <ILucideLink2 />, isActive: useActive(editor, 'link'), active: () => editor().commands.toggleLink({ href: '' }), popover: LinkPane },
  ]

  return (
    <div class='flex flex-col max-w-[794px] min-h-[1123px] ma my-20 p10 box-border shadow-lg dark-bg-gray/05'>
      {/* <LinkPane editor={editor()} /> */}
      {editor().view.dom}
      <br />
      <FloatingMenu editor={editor()}>
        <div class='menu py-1'>
          <For each={nodes}>
            {node => (
              <div class={`li flex aic mx-1 px-2 py-1 rd-2`} onClick={() => node.cb()}>
                <div class='mr-1.5 lh-1em'><Dynamic component={node.icon} /></div>
                {node.label}
              </div>
            )}
          </For>
        </div>
      </FloatingMenu>

      <BubbleMenu editor={editor()}>
        <div class='menu-x flex aic lh-1em'>
          <For each={marks}>
            {node => {
              // const { refs, floatingStyles } = createFloating({ placement: 'top', middleware: [offset(12)], whileElementsMounted: autoUpdate })
              // onMount(() => refs.setReference(icon))
              // refs.setReference(icon)
              return (
                <div class={`li ${node.isActive() && 'active'} p-1 my-1 rd-2`} onClick={() => node.active()}>
                  <Popover
                    reference={<Dynamic component={node.icon} />}
                    floating={node.popover && node.isActive() ? <node.popover editor={editor()} /> : void 0}
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
