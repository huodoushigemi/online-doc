import type { Editor } from '@tiptap/core'
import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu'
import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu'
import { FloatingMenuPlugin } from '@tiptap/extension-floating-menu'
import { createEffect, createSignal, onCleanup, onMount, splitProps } from 'solid-js'
import { Portal } from 'solid-js/web'
import IconoirOpenNewWindow from './icons/IconoirOpenNewWindow'
import { createMutable } from 'solid-js/store'
import { useActive, useEditorTransaction } from './Editor'
import { model } from './hooks'

type AAA<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>

export function FloatingMenu(attrs: AAA<FloatingMenuPluginProps, 'editor'> & Record<string, any>) {
  const [_, props] = splitProps(attrs, ['children'])
  let menuEl!: HTMLDivElement
  onMount(() => {
    menuEl.style.visibility = 'hidden'
  })

  createEffect(() => {
    if (props.editor?.isDestroyed) return

    const { editor } = props

    const plugin = FloatingMenuPlugin({
      editor,
      element: menuEl,
      pluginKey: props.pluginKey || 'floatingMenu',
      shouldShow: ({ editor, state }) => {
        // 获取当前节点 并判断是否为 p 节点
        const { selection } = state
        const node = selection.$from.node()
        return node.textContent[0] == '/'
      },
      options: {
        placement: 'bottom-start',
        ...props.options
      },
    })

    editor.registerPlugin(plugin)

    onCleanup(() => {
      editor.unregisterPlugin(props.pluginKey || 'floatingMenu')
      window.requestAnimationFrame(() => {
        if (menuEl.parentNode) {
          menuEl.parentNode.removeChild(menuEl)
        }
      })
    })
  })

  return (
    <Portal ref={menuEl} {...props} mount={document.body}>
      {attrs.children}
    </Portal>
  )
}

export function BubbleMenu(attrs: AAA<BubbleMenuPluginProps, 'editor'> & Record<string, any>) {
  let [_, props] = splitProps(attrs, ['children'])
  let menuEl!: HTMLDivElement
  onMount(() => {
    menuEl.style.visibility = 'hidden'
    menuEl.style.position = 'absolute'
  })

  createEffect(() => {
    if (props.editor?.isDestroyed) return

    const { editor } = props

    const plugin = BubbleMenuPlugin({
      editor,
      element: menuEl,
      pluginKey: props.pluginKey || 'bubbleMenu',
      ...props,
      options: {
        ...props.options
      },
    })

    editor.registerPlugin(plugin)

    onCleanup(() => {   
      editor.unregisterPlugin(props.pluginKey || 'bubbleMenu')
      window.requestAnimationFrame(() => {
        if (menuEl.parentNode) {
          menuEl.parentNode.removeChild(menuEl)
        }
      })
    })
  })

  return (
    <Portal ref={menuEl} {...props} mount={document.body}>
      {attrs.children}
    </Portal>
  )
}

// export function Popover(props) {
//   const { refs, floatingStyles } = createFloating()
//   return (
//     <div ref={refs.setFloating} style={floatingStyles()}>{props.children}</div>
//   )
// }

export function ImageBubbleMenu(props: { editor: Editor, uploadImage: () => Promise<string> }) {
  const current = () => props.editor.state.doc.nodeAt(props.editor.state.selection.from)
  const active = useActive(props.editor, 'image')
  const srcSignal = createSignal('')
  const src = useEditorTransaction(props.editor, () => active() ? current()?.attrs.src : '')
  createEffect(() => srcSignal[1](src()))
  return (
    <BubbleMenu editor={props.editor} shouldShow={({ editor, state }) => editor.isActive('image')} updateDelay={0}>
      <div class='menu-x flex aic p-1'>
        <input class='pl-2 outline-0 b-0 text-4 op75' autofocus placeholder='https://……' use:model={srcSignal} />
        <div class='li flex aic p-1 rd-2' onClick={() => props.uploadImage().then(src => props.editor.chain().setImage({ src }).focus().run())}><ILucideUpload /></div>
      </div>
    </BubbleMenu>
  )
}

// 
export function LinkPane(props: { editor: Editor }) {
  const attrs = createMutable({ href: '', target: '', ...props.editor.getAttributes('link') })
  const current = () => props.editor.state.selection.$from.node()
  const chain = () => props.editor.chain().extendMarkRange('link')

  function ok() {
    if (attrs.href?.trim()) {
      chain().setLink(attrs).focus().run()
    } else {
      chain().unsetLink().focus().run()
    }
  }

  return (
    <div class='menu-x flex aic p-1' {...props}>
      <input class='pl-2 outline-0 b-0 text-4 op75' autofocus placeholder='https://……' onKeyDown={e => e.key == 'Enter' && ok()} />
      <ILucideCornerDownLeft class='li flex aic p-1 rd-2' onClick={ok} />
      <div class='self-stretch ml-1! mr-.5! my-1 w-1px bg-gray/20' />
      <IconoirOpenNewWindow class='li flex aic p-1 rd-2' onClick={() => attrs.target = attrs.target ? '' : '_blank'} />
      <ILucideTrash class='li flex aic p-1 rd-2' onClick={() => props.editor.chain().unsetLink().focus().run()} />
    </div>
  )
}

export const panes = [
  {
    type: 'link',
    label: '链接',
    icon: ILucideLink2,
    component: LinkPane,
  }
]