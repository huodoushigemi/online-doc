import { createRoot, type Component } from 'solid-js'
import type { ICellRendererParams, ICellRendererComp } from 'ag-grid-community'
import { render } from 'solid-js/web'

export function defineCellRenderer(Comp: Component<any>) {
  return class CellRenderer implements ICellRendererComp {
    el!: HTMLElement
    clean!: Function

    init(props: ICellRendererParams) {
      createRoot(cleaup => {
        this.el = (<Comp {...props} />) as unknown as HTMLElement
        this.clean = cleaup
      })
    }
    getGui(): HTMLElement {
      return this.el
    }
    destroy?(): void {
      this.clean()
    }
    refresh(params: ICellRendererParams<any, any, any>) {
      return true
    }
  }
}

/**
 * CellEditor 高阶适配器，将 Solid 组件包装为 ag-grid cellEditor 接口
 * @param Comp 编辑器组件
 * @returns ag-grid cellEditor 对象
 */
export function defineCellEditor(Comp: Component<any>) {
  return function (params: any) {
    let value = params.value
    let committed = false
    let container = document.createElement('div')
    let unmount: (() => void) | undefined

    const onCommit = (v: any) => {
      value = v
      committed = true
      params.stopEditing()
    }
    const onCancel = () => {
      committed = false
      params.stopEditing()
    }

    // 渲染 Solid 组件到 container
    unmount = render(() => <Comp {...params} value={params.value} onCommit={onCommit} onCancel={onCancel} />, container)

    return {
      getGui: () => container,
      getValue: () => value,
      afterGuiAttached: () => {
        // 聚焦第一个可输入元素
        const input = container.querySelector('input,select,textarea') as HTMLElement
        input?.focus()
      },
      destroy: () => {
        unmount?.()
      },
    }
  }
}
