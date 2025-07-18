import { createEffect, createMemo, createSignal, For, on, onCleanup, splitProps } from 'solid-js'
import { createLazyMemo } from '@solid-primitives/memo'
import { log } from '../utils'
import { combineProps } from '@solid-primitives/props'

function define(key) {
  const signal = createSignal()
  Object.defineProperty(this, key, {
    get() { return signal[0]() },
    set(v) { signal[1](v) }
  })
  return signal
}

function memo<T>(key, fn: () => T) {
  const signal = createLazyMemo(fn)
  Object.defineProperty(this, key, {
    get() { return signal() },
  })
  return signal
}

export abstract class $Node {
  data: any
  constructor(data: any) {
    this.data = data

    createEffect(() => {
      const children = this.children
      children?.map(e => e.parent = this)
      onCleanup(() => children?.map(e => e.parent = undefined))
    })
  }

  // abstract get Node(data): $Node
  abstract get id(): any
  abstract get label(): string
  abstract getChildren(): $Node[] | undefined
  
  $children = memo.call(this, 'children', () => this.getChildren())
  declare children: $Node[] | undefined
  
  $parent = define.call(this, 'parent')
  declare parent: $Node | undefined

  $deep = memo.call(this, 'deep', () => this.parent ? this.parent.deep + 1 : 0)
  declare deep: number

  $root = memo.call(this, 'root', () => this.parent ? this.parent.root : this)
  declare root: $Node

  get descendants(): $Node[] {
    return this.children?.flatMap(e => [e, ...e.descendants]) || []
  }
}

export function Tree(_: { data: any; Node: { new (data: any): $Node } }) {
  const [props, attrs] = splitProps(_, ['data', 'Node'])

  const Node = props.Node ?? class _Node extends $Node {
    get id() { return this.data.id }
    get label() { return this.data.label }
    getChildren() { return this.data.children?.map(e => new _Node(e)) }
  }

  const node = createMemo(() => new Node(props.data))
  const flated = createMemo(() => [node(), ...node().descendants])

  return (
    <div {...combineProps({ class: 'tt-menu' }, attrs)}>
      <For each={flated()}>
        {(node, index) => (
          <div class='li py-1 px-4' style={`padding-left: ${(node.deep + 1) * 16}px`}>{ node.label }</div>
        )}
      </For>
    </div>
  )
}
