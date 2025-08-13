import { createRoot, createSignal, type Component, type Signal } from 'solid-js'
import type { ICellRendererParams, ICellRendererComp, ICellEditorParams, ICellEditorComp, AgPromise, IHeaderComp, IHeaderParams } from 'ag-grid-community'

export function defineCellRenderer<T extends Record<string, any>>(Comp: Component<ICellRendererParams & T>) {
  return class CellRenderer implements ICellRendererComp {
    el!: HTMLElement
    dispose!: Function
    props!: Signal<any>

    init(props: ICellRendererParams) {
      createRoot(dispose => {
        this.props = createSignal(props)
        this.el = (<Comp {...this.props[0]()} />) as unknown as HTMLElement
        this.dispose = dispose
      })
    }
    getGui(): HTMLElement {
      return this.el
    }
    destroy?(): void {
      this.dispose()
    }
    refresh(params: ICellRendererParams<any, any, any>) {
      this.props[1](params)
      return true
    }
  }
}

/**
 * CellEditor 高阶适配器，将 Solid 组件包装为 ag-grid cellEditor 接口
 * @param Comp 编辑器组件
 * @returns ag-grid cellEditor 对象
 */
export function defineCellEditor<T extends Record<string, any>>(Comp: Component<ICellEditorParams & T>) {
  return class CellEditor implements ICellEditorComp {
    el!: HTMLElement
    dispose!: Function
    props!: Signal<any>
    value: any

    getValue() {
      return this.value
    }
    refresh?(params: ICellEditorParams<any, any, any>): void {
      this.props[1](params)
    }
    afterGuiAttached?(): void {
      this.el.parentElement?.querySelector('input,select,textarea,[tabindex="0"]')?.focus?.()
    }
    // isPopup?(): boolean {
    //   return false
    // }
    getPopupPosition?(): 'over' | 'under' | undefined {
      return 'over'
    }
    // isCancelBeforeStart?(): boolean {
    //   throw new Error('Method not implemented.')
    // }
    // isCancelAfterEnd?(): boolean {
    //   throw new Error('Method not implemented.')
    // }
    focusIn?(): void {
      // 
    }
    focusOut?(): void {
      // 
    }
    // getValidationElement?(): HTMLElement {
    //   throw new Error('Method not implemented.')
    // }
    // getValidationErrors?(): string[] | null {
    //   throw new Error('Method not implemented.')
    // }
    getGui(): HTMLElement {
      return this.el
    }
    destroy?(): void {
      this.dispose?.()
    }
    init?(params: ICellEditorParams<any, any, any>): AgPromise<void> | void {
      createRoot(dispose => {
        this.props = createSignal(params)
        this.value = params.value

        const onCommit = (v: any) => {
          this.value = v
          params.stopEditing()
        }
        const onCancel = () => {
          params.stopEditing()
        }

        this.el = (<Comp {...this.props[0]()} onCommit={onCommit} onCancel={onCancel} />) as unknown as HTMLElement
        this.dispose = dispose
      })
    }
  }
}

export function defineHeaderRenderer<T extends Record<string, any>>(Comp: Component<IHeaderParams & T>) {
  return class HeaderRenderer implements IHeaderComp {
    el!: HTMLElement
    dispose!: Function
    props!: Signal<any>

    init?(params: IHeaderParams<any, any>): AgPromise<void> | void {
      createRoot(dispose => {
        this.props = createSignal(params)
        this.el = (<Comp {...this.props[0]()} />) as unknown as HTMLElement
        this.dispose = dispose
      })
    }
    getGui(): HTMLElement {
      return this.el
    }
    destroy?(): void {
      this.dispose()
    }
    refresh(params: IHeaderParams) {
      this.props[1](params)
      return true
    }
  }
}