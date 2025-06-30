import { children, createEffect, createMemo, createResource, createSignal, mergeProps, splitProps } from "solid-js"
import { createRender } from "./Render"
import { autoUpdate, createFloating } from "floating-ui-solid"
import { combineProps } from '@solid-primitives/props'
import { pointerHover } from "@solid-primitives/pointer"
import { createMutable } from "solid-js/store"
import { VDir } from "../hooks/useDir"

export function Menu(props) {
  
  const _Li = _e => {
    let el!: HTMLDivElement
    const [floating, setFloating] = createSignal<HTMLElement>()
    const [hover, setHover] = createSignal(false)
    pointerHover
    
    const style = createMemo(() => floating() ? createFloating({
      strategy: 'fixed',
      placement: 'right-start',
      elements: { reference: () => el, floating },
      whileElementsMounted(ref, float, update) {
        return autoUpdate(ref, float, update, { ancestorResize: true, elementResize: true, layoutShift: true, ancestorScroll: true })
      }
    }).floatingStyles : void 0)
    
    createEffect(() => {
      floating() && Object.assign(floating()!.style, style()?.() ?? {})
    })

    const req = createMutable({ loading: false })

    function onClick() {
      if (req.loading) return
      const ret = e.cb?.()
      if (!(ret instanceof Promise)) return
      req.loading = true
      ret.finally(() => req.loading = false)
    }

    const [_, e] = splitProps(_e, ['children'])
    const child = children(() => _.children)
    return (
      <div
        ref={el}
        use:pointerHover={setHover}
        {...combineProps({ class: `li flex aic rd-2 ${props.x ? 'my-1 p-1' : 'mx-1 pl-1 pr-4 py-1'} ${e.isActive?.() && 'active'}` }, e)}
        cb={null}
        icon={null}
        on:click={onClick}
      >
        <div class={`flex aic ${props.x ? '' : props.density == 'comfortable' ? 'ml-1 mr-2.5' : 'ml-.5 mr-1'} `}>
          {req.loading ? <IMyLoading /> : e.icon}
        </div>
        {e.label}
        {hover() && child() && <_Menu ref={setFloating}>{child()}</_Menu>}
      </div>
    )
  }

  const Li = createRender({
    is: _Li,
    processProps: props => {
      let i = 0
      Array.isArray(props.children) && props.children.forEach((e) => !e.is && typeof e == 'object' && (e['data-index'] = i++))
      return props
    }
  })

  const _Menu = props => (
    <div
      {...combineProps({ class: 'tt-menu max-h-100 overflow-auto' }, props)}
      use:VDir={props.usedir}
      on:click={e => e.stopPropagation()}
    >
      {props.children}
    </div>
  )

  createEffect(() => {
    console.log('xxxx', props.items)
  })
  
  return <Li {...combineProps({ class: props.x ? 'flex tt-menu-x' : 'tt-menu' }, props)} is={_Menu} items={null} children={props.items} />
}