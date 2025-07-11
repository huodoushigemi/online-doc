import { Editor } from '@tiptap/core'
import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu'
import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu'
import { FloatingMenuPlugin } from '@tiptap/extension-floating-menu'
import { createEffect, createMemo, createSignal, For, mergeProps, onCleanup, onMount, splitProps } from 'solid-js'
import { Dynamic, Portal, render } from 'solid-js/web'
import IconoirOpenNewWindow from './icons/IconoirOpenNewWindow'
import { createMutable } from 'solid-js/store'
import { useActive, useEditorTransaction } from './Editor'
import { model, toSignle } from './hooks'
import { Menu } from './components/Menu'
import { log, mergeRect } from './utils'
import { Floating } from './components/Popover'
import { offset } from 'floating-ui-solid'

type AAA<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>

export function FloatingMenu(attrs: AAA<FloatingMenuPluginProps, 'editor'> & Record<string, any>) {
  const [_, props] = splitProps(attrs, ['children'])
  let menuEl!: HTMLDivElement
  onMount(() => {
    menuEl.style.visibility = 'hidden'
    menuEl.style.zIndex = '1'
  })

  const text = useEditorTransaction(() => props.editor, editor => editor.state.selection.$from.node().textContent)
  const search = createMemo(() => ['/', '、'].includes(text()[0]) ? text().slice(1) : null)
  
  createEffect(() => {
    if (props.editor?.isDestroyed) return

    const { editor } = props

    const plugin = FloatingMenuPlugin({
      editor,
      element: menuEl,
      pluginKey: props.pluginKey || 'floatingMenu',
      // shouldShow: () => text()[0] == '/',
      shouldShow: () => true,
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
    <div ref={menuEl} {...props}>
      {search() != null
        ? typeof attrs.children == 'function' ? attrs.children(search) : attrs.children
        : void 0
      }
    </div>
  )
}

export function BubbleMenu(attrs: { editor: Editor } & Record<string, any>) {
  const { editor } = attrs
  let [_, props] = splitProps(attrs, ['children'])
  const toRect = (e) => DOMRect.fromRect({ x: e.left, y: e.top, width: e.right - e.left, height: e.bottom - e.top })
  const rect = useEditorTransaction(editor, editor => mergeRect(toRect(editor.view.coordsAtPos(editor.state.selection.from)), toRect(editor.view.coordsAtPos(editor.state.selection.to))))

  return <Floating
    placement='top'
    middleware={[offset({ mainAxis: 6 })]}
    whileElementsMounted={void 0}
    reference={rect() ? { getBoundingClientRect: rect } : void 0}
    floating={() => <div>{attrs.children}</div>}
  />
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

  createEffect(() => {
    chain().updateAttributes('link', { target: attrs.target }).run()
  })

  return (
    <div class='tt-menu-x flex aic p-1' {...props}>
      <input class='pl-2 outline-0 b-0 text-4 op75' autofocus placeholder='https://……' onKeyDown={e => e.key == 'Enter' && ok()} use:model={toSignle(attrs, 'href')} />
      {/* <ILucideCornerDownLeft class='li flex aic p-1 rd-2' onClick={ok} />
      <div class='self-stretch ml-1! mr-.5! my-1 w-1px bg-gray/20' /> */}
      <IconoirOpenNewWindow class='li flex aic p-1 rd-2' on:click={() => attrs.target = attrs.target ? '' : '_blank'} />
      <ILucideTrash class='li flex aic p-1 rd-2' on:click={() => chain().unsetLink().focus().run()} />
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