import { createEffect, createMemo, createSignal, For, Index, on, onCleanup, splitProps } from 'solid-js'
import { createLazyMemo } from '@solid-primitives/memo'
import { combineProps } from '@solid-primitives/props'
import { castArray } from 'es-toolkit/compat'
import { log } from '../utils'

function define(that, key) {
  const signal = createSignal()
  Object.defineProperty(that, key, {
    get() { return signal[0]() },
    set(v) { signal[1](v) }
  })
  return signal
}

function memo<T>(that, key, fn: () => T) {
  const signal = createLazyMemo(fn)
  Object.defineProperty(that, key, {
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
  // abstract get id(): any
  abstract get label(): string
  abstract getChildren(): $Node[] | undefined
  
  declare children: $Node[] | undefined
  $children = memo(this, 'children', () => this.getChildren())
  
  declare parent: $Node | undefined
  $parent = define(this, 'parent')
  
  declare deep: number
  $deep = memo(this, 'deep', () => this.parent ? this.parent.deep + 1 : 0)

  declare index: number
  $index = memo(this, 'index', () => this.parent?.children?.indexOf(this))

  declare prev: $Node | undefined
  $prev = memo(this, 'prev', () => this.parent?.children?.[this.index - 1])

  declare next: $Node | undefined
  $next = memo(this, 'next', () => this.parent?.children?.[this.index + 1])

  declare root: $Node
  $root = memo(this, 'root', () => this.parent ? this.parent.root : this)

  declare path: $Node[]
  $path = memo(this, 'path', () => {
    const ret = [this] as $Node[]
    let e: $Node = this
    while (e.parent) ret.push(e = e.parent)
    return ret.reverse()
  })

  get descendants(): $Node[] {
    return this.children?.flatMap(e => [e, ...e.descendants]) || []
  }

  remove() {
    // this.
  }
}

export function Tree(_: { data: any; Node: { new (data: any): $Node } }) {
  const [props, attrs] = splitProps(_, ['data', 'Node'])

  const Node = props.Node ?? class _Node extends $Node {
    get id() { return this.data.id }
    get label() { return this.data.label }
    getChildren() { return this.data.children?.map(e => new _Node(e)) }
  }

  const root = createMemo(() => new (class extends Node {
    get label() { return '' }
    getChildren() { return castArray(this.data || []).map(e  => new Node(e)) }
  })(props.data))

  const flated = createMemo(() => root().descendants)

  return (
    <div {...combineProps({ class: 'tt-menu' }, attrs)}>
      <Index each={flated()}>
        {(node, index) => (
          <div class='li py-1 px-4' style={`padding-left: ${(node().deep) * 16}px`}>{ node().label }</div>
        )}
      </Index>
    </div>
  )
}
