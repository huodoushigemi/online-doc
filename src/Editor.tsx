import { createMemo, createEffect, createSignal, onCleanup, For, createRenderEffect, createComputed } from "solid-js"
import { Dynamic, Portal } from 'solid-js/web'
import { createMutable } from "solid-js/store"
import { inRange, pickBy } from "es-toolkit"
import { isEmpty } from "es-toolkit/compat"
import { access, type MaybeAccessor, type MaybeAccessorValue } from '@solid-primitives/utils'
import { createWritableMemo } from '@solid-primitives/memo'
import type { EditorOptions, ChainedCommands } from '@tiptap/core'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { TableKit } from '@tiptap/extension-table'
import { Focus, Placeholder } from '@tiptap/extensions'
import { ListKit } from '@tiptap/extension-list'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'
import { useDark, useMemoAsync } from "./hooks"
import { VDir } from './hooks/useDir'
import { BubbleMenu, FloatingMenu, LinkPane } from './Floating'
import { chooseImage, file2base64, log } from './utils'
import { Floating, Popover } from './components/Popover'
import { offset } from 'floating-ui-solid'
import { Menu } from './components/Menu'


import './index.scss'
import './tiptap.scss'
import 'virtual:uno.css'

import { ColumnsKit } from './extensions/Columns'
import { Iframe } from './extensions/Iframe'
import { FormKit } from './extensions/Form'
import { ImageKit } from './extensions/Image'
import { menus } from "./context"

export function useEditorTransaction<T>(
  instance: MaybeAccessor<Editor>,
  read: (value: Editor) => T
): () => T {
  const [depend, update] = createSignal(undefined, { equals: false })

  createEffect(() => {
    const editor = access(instance)
    if (editor) {
      editor.on("transaction", update)
      onCleanup(() => editor.off("transaction", update))
    }
  })

  return createMemo(() => {
    depend()
    return read(access(instance))
  })
}

export function chainReplace(editor: Editor) {
  return editor.chain().command(({ tr, state }) => {
    const { $from, $to } = state.selection
    if ($from.pos == $to.pos) {
      const nodePos = $from.pos - $from.parentOffset
      tr.delete(nodePos, $to.pos)
    } else {
      tr.delete($from.pos, $to.pos - 1)
      // tr.deleteSelection()
    }
    return true
  }).focus()
}

export function useActive(editor: MaybeAccessor<Editor>, key: string) {
  return useEditorTransaction(editor, editor => editor.isActive(key))
}

export default function useEditor(props?: () => Partial<EditorOptions>) {
  const [isDark] = useDark()
  return createMemo(() => {
    const instance = tiptap(props?.(), isDark())

    onCleanup(() => {
      instance.destroy()
    })

    return instance
  })
}

export function useNodeAttrs(editor: MaybeAccessor<Editor>, node: MaybeAccessor<Editor['state']['doc'] | void>) {
  const [attrs] = createWritableMemo(() => createMutable({ ...access(node)?.attrs }))
  createComputed(old => {
    if (!access(node)) return
    const obj = { ...attrs() }
    if (!old) return obj
    const tr = access(editor).state.tr
    const pos = getPos(access(editor), access(node))
    const diff = pickBy(obj, (v, k) => v != old?.[k])
    for (const k in diff) tr.setNodeAttribute(pos, k, diff[k])
    isEmpty(diff) || access(editor).view.dispatch(tr)
    return obj
  })
  return attrs
}

function tiptap(props?: Partial<EditorOptions>, isDark?: boolean) {
  return new Editor({
    ...props,
    extensions: [
      TextStyleKit,
      StarterKit.configure({
        link: { openOnClick: false },
        codeBlock: false,
      }),
      Highlight,
      CodeBlockShiki.configure({ defaultTheme: `github-${isDark ? 'dark' : 'light'}`, exitOnArrowDown: false, exitOnTripleEnter: false }),
      // Selection,
      ColumnsKit,
      FormKit,
      Iframe,
      ListKit.configure({
        bulletList: false,
        listItem: false,
        orderedList: false,
        listKeymap: false,
      }),
      Focus,
      TableKit.configure({
        table: { resizable: true, cellMinWidth: 50 },
      }),
      // Image.configure({ inline: true, allowBase64: true, HTMLAttributes: { style: 'max-width: 100%', contenteditable: true } }),
      ImageKit,
      Placeholder.configure({
        placeholder: 'Type / to browse options',
      }),
      // FloatingMenu.configure({
      //   shouldShow: ({ editor, view, state, oldState }) => {
      //     return editor.isActive('paragraph')
      //   }
      // })
      ...props?.extensions ?? []
    ]
  })
}

export function getPos(editor: Editor, node: typeof editor.state.doc) {
  let ret: number
  editor.state.doc.descendants((e, pos) => {
    if (node == e) ret = pos
    if (ret) return false
  })
  return ret
}

export function isFocus(editor: Editor, node: typeof editor.state.doc) {
  const pos = getPos(editor, node)
  return inRange(editor.state.selection.anchor, pos, pos + node.nodeSize)
}

export function isSelcet(editor: Editor, node: typeof editor.state.doc) {
  const pos = getPos(editor, node)
  return editor.state.selection.from == pos && editor.state.selection.to == pos + node.nodeSize
}

export async function html2md(html: string) {
  const { Markdown } = await import('tiptap-markdown')
  const editor = tiptap({ extensions: [Markdown] })
  editor.commands.setContent(html)
  const ret = editor.storage.markdown.getMarkdown()
  editor.destroy()
  return ret
}

// 编辑器 组件
export function TiptapEditor() {
  const [isDark] = useDark()

  const editor = useEditor(() => ({
    // content: `<h1>wc-mdit</h1><p>A markdown-to-html web component.</p><h2>⚙️ Installation</h2><ul><li><p>npm</p></li></ul><pre><code>npm i wc-mdit</code></pre><ul><li><p>scripts</p></li></ul><pre><code>&lt;script src="https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js"&gt;&lt;/script&gt;\n&lt;script src="https://cdn.jsdelivr.net/npm/wc-mdit/dist/wc-mdit.umd.js"&gt;&lt;/script&gt;</code></pre><h2>🚀 Example</h2><pre><code>import 'wc-mdit'\n\nfunction App() {\n  return (\n    &lt;wc-mdit content='# H1' theme='github-dark' /&gt;\n    // or\n    &lt;wc-mdit src="https://raw.githubusercontent.com/huodoushigemi/wc-mdit/refs/heads/main/README.md" theme='github-dark' /&gt;\n  )\n}</code></pre><h2>📄 Props</h2><table style="min-width: 150px"><colgroup><col style="min-width: 50px"><col style="min-width: 50px"><col style="min-width: 50px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Attribute</p></th><th colspan="1" rowspan="1"><p>Type</p></th><th colspan="1" rowspan="1"><p>Description</p></th></tr><tr><td colspan="1" rowspan="1"><p>src</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p>URL to external markdown file.</p></td></tr><tr><td colspan="1" rowspan="1"><p>content</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p></p></td></tr><tr><td colspan="1" rowspan="1"><p>theme</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p></p></td></tr><tr><td colspan="1" rowspan="1"><p>css</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p><code>&lt;style&gt;{css}&lt;/style&gt;</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>no-shadow</p></td><td colspan="1" rowspan="1"><p>Boolean</p></td><td colspan="1" rowspan="1"><p>If set, renders and stamps into <strong>light DOM</strong> instead. Please know what you are doing.</p></td></tr><tr><td colspan="1" rowspan="1"><p>body-class</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p>Class names forwarded to <code>.markdown-body</code> block.</p></td></tr><tr><td colspan="1" rowspan="1"><p>body-style</p></td><td colspan="1" rowspan="1"><p>String</p></td><td colspan="1" rowspan="1"><p>Style forwarded to <code>.markdown-body</code> block.</p></td></tr><tr><td colspan="1" rowspan="1"><p>options</p></td><td colspan="1" rowspan="1"><p>Object</p></td><td colspan="1" rowspan="1"><p><code>new MarkdownIt(options)</code></p></td></tr></tbody></table><p></p>`
    content: ``
  }))

  const sss = createMemo(() => menus(editor()))
  const _menus = createMemo(() => sss()())
  
  createRenderEffect(() => {
    window.editor = editor()
    editor().view.dom.classList.add(...'outline-0 flex-1'.split(' '))
    editor().view.dom.classList.add(...`markdown-body max-w-[794px] min-h-[1123px] mx-a! my-20! p10 box-border shadow-lg dark-bg-gray/05`.split(' '))
    editor().view.dom.spellcheck = false
    editor().commands.focus()
  })

  const current = useEditorTransaction(editor, editor => editor.state.selection.$from.node())
  // const active = (k: string, v?: any) => useEditorTransaction(editor, editor => editor.commands.)

  // 清空当前行内容
  function chain() {
    return chainReplace(editor())
  }

  async function uploadImage() {
    const src = await chooseImage().then(file2base64)
    chain().setImage({ src }).run()
  }

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
    { label: '表单', kw: 'form', icon: () => <IMyForms />, cb: () => chain().insertForm().run() },
  ]

  return (
    <div class=''>
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

      <BubbleMenu editor={editor()}>
        {_menus().length ? <Menu items={_menus()} x={true} /> : void 0}
      </BubbleMenu>
    </div>
  )
}