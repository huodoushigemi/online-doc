import { createSignal, For, Index, onCleanup } from 'solid-js'
import { render } from 'solid-js/web'
import { Editor, findParentNode, findParentNodeClosestToPos, NodePos, NodeView, type NodeViewRenderer } from '@tiptap/core'
import { createEffect, createMemo, useTransition } from 'solid-js'
import { delay, isEqual, xor } from 'es-toolkit'
import { getPos, useActive, useEditorTransaction } from '../Editor'
import { Floating } from '../components/Popover'
import { Menu } from '../components/Menu'
import { Table as _Table, TableView } from '@tiptap/extension-table'
import { createMutationObserver } from '@solid-primitives/mutation-observer'
import { createElementBounds, getElementBounds } from '@solid-primitives/bounds'
import { log } from '../utils'
import { useHover, useSignle2 } from '../hooks'
import { offset } from 'floating-ui-solid'
import { Split } from '../components/Split'

class View extends TableView implements ReturnType<NodeViewRenderer> {
  constructor(node: NodePos['node'], cellMinWidth) {
    super(node, cellMinWidth)
    // this.table.style.fontSize = '22px'

    this.destroy = render(() => {
      const [view, setView] = createSignal<HTMLElement>()
      const [hvoer] = useSignle2(useHover(() => [this.table, view()]), { before: v => v ? v : delay(150) })
      const [widths, setWidths] = createSignal<number[]>([], { equals: isEqual })
      const [heights, setHeights] = createSignal<number[]>([], { equals: isEqual })

      createMutationObserver(this.table, { subtree: true, attributes: true, childList: true }, () => {
        const ws = [...this.table.querySelector('tr')?.children || []].flatMap((el: HTMLTableCellElement) => el.colSpan > 1 ? Array(el.colSpan).fill(0).map(() => el.offsetWidth / el.colSpan) : el.offsetWidth)
        setWidths(ws)
        const hs = [...this.table.querySelectorAll('tr')].flatMap((el: HTMLTableCellElement) => el.rowSpan > 1 ? Array(el.rowSPan).fill(0).map(() => el.offsetHeight / el.rowSpan) : el.offsetHeight)
        setHeights(hs)
      });

      onCleanup(() => view()?.parentElement?.remove())

      const Dot = (props) => (
        <div class={`flex ${props.x ? 'justify-center w-full' : 'aic h-full'}`}>
          <div class={`flex-shrink-0 flex justify-center aic bg-gray/25 rd-full hover:scale-[2] ${props.x ? 'translate-y--1/2' : 'translate-x--1/2'}`} onClick={props.onAdd}>
            <ILucideCirclePlus class='w-2 h-2 op0 hover:op100 c-gray' />
          </div>
        </div>
      )

      ; // 
      <Floating
        reference={this.table}
        floating={() => (
          <Split class='absolute flex h-4' both handle={i => <Dot i={i} x onAdd={() => {editor.commands.addColumnBefore()}} />}>
            <Index each={widths()}>
              {(v, i) => <div class='cell-handle' style={`width: ${v()}px;`} onClick={() => selectCol(i)}></div>}
            </Index>
          </Split>
        )}
        portal={view()}
        placement={'top-start'}
      />

      ; // 
      <Floating
        reference={this.table}
        floating={() => (
          <Split class='absolute flex flex-col w-4' dir='y' both handle={i => <Dot i={i} />}>
            <Index each={heights()}>
              {(v, i) => <div class='cell-handle' style={`height: ${v()}px;`} onClick={() => selectRow(i)}></div>}
            </Index>
          </Split>
        )}
        portal={view()}
        placement={'left-start'}
      />

      // todo rowspan
      function selectRow(i) {
        declare const editor: Editor
        const tds = node.children[i].children
        editor.commands.setCellSelection({ anchorCell: getPos(editor, tds[0]),  headCell: getPos(editor, tds[tds.length - 1]) })
      }

      // todo colspan
      function selectCol(i) {
        declare const editor: Editor
        const tds = node.children.map(e => e.children[i])
        editor.commands.setCellSelection({ anchorCell: getPos(editor, tds[0]),  headCell: getPos(editor, tds[tds.length - 1]) })
      }
      
      return <div ref={setView} style={`display: ${hvoer() || 'none'}`} />
    }, document.body.appendChild(<div></div>))
  }
  // destroy?: (() => void) | undefined/
}

const addOptions = _Table.config.addOptions
_Table.config.addOptions = function() {
  return {
    ...addOptions?.call(this),
    View
  }
}

// import { TableKit as _TableKit } from '@tiptap/extension-table'

// export const TableKit = _TableKit.extend({
//   addCommands: () => ({
//     selectTableRow: () => 
//   })
// })

export { TableKit } from '@tiptap/extension-table'

export const menus = []

const menus2 = (editor: Editor) => {
  const name = ['tableCell', 'tableHeader']
  const cell = useEditorTransaction(editor, editor => (
    editor.state.selection.ranges.map(e => findParentNodeClosestToPos(e.$from, e => name.includes(e.type.name))?.node).filter(e => e)
  ), {
    equals: (a, b) => !xor(a || [], b || []).length
  })

  return createMemo(() => {
    if (!cell().length) return
    const ret = [] as any[]

    ret.push({ label: '表头', isActive: useActive(editor, 'tableHeader'), cb: () => editor.chain().toggleHeaderCell().run() })

    if (cell().length == 1) {
      if (cell()[0]!.attrs.colspan > 1 || cell()[0]?.attrs.rowspan > 1) {
        ret.push({ icon: <IMySplitCell />, cb: () => editor.chain().splitCell().focus().run() })
      }
    }
    else if (cell().length > 1) {
      ret.push({ icon: <IMyMergeCell />, cb: () => editor.chain().mergeCells().focus().run() })
    }

    ret.push({ icon: <ILucideTrash2 />, class: 'text-nowrap', children: [
      { label: '删除行', cb: () => editor.chain().deleteRow().focus().run() },
      { label: '删除列', cb: () => editor.chain().deleteColumn().focus().run() },
    ] })

    return ret
  })
}

export const mounted = (editor: Editor) => {
  const pos = useEditorTransaction(editor, editor => findParentNodeClosestToPos(editor.state.selection.$from, node => node.type.name == 'table')?.pos)
  const rect = createMemo(() => pos() != null ? (editor.view.nodeDOM(pos()!) as HTMLElement)?.querySelector('& > table')?.getBoundingClientRect() : void 0)

  const menu = menus2(editor)
  
  createEffect(() => {
    if (!rect()) return
    <Floating
      reference={{ getBoundingClientRect: () => rect()! }}
      floating={<div><Menu x={true} items={menu()} /></div>}
      placement={'top-end'}
      middleware={[offset({ mainAxis: 20 })]}
      portal={document.body}
    />
  })
}
