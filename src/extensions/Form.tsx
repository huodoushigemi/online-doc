import { createMemo } from 'solid-js'
import { Node } from '@tiptap/core'
import { createNodeView } from './NodeView'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    form: {
      insertForm: (props?: { src: string }) => ReturnType
    }
  }
}

function Form(props) {
  // const src = createMemo(() => `https://huodoushigemi.github.io/el-form-render/demo?props=${}`)
  return <iframe {...props} />
}

const template =
`<template>
  <Form :model :items label-width="60px" @_submit="onSubmit">
    <el-form-item>
      <el-button type="primary" native-type="submit">提交</el-button>
      <el-button native-type="reset">重置</el-button>
    </el-form-item>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import Form, { schema2items } from 'el-form-render'

const model = ref({})

const items = schema2items(model, {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    remark: { type: 'string' },
  }
})

function onSubmit() {
  alert('Success')
}
</script>
`

export const FormKit = Node.create({
  name: 'el-form-render',
  group: 'block',
  atom: true,
  parseHTML: () => [{ tag: '[data-type="el-form-render"]', priority: 99 }],
  addAttributes: () => ({
    src: {},
    style: { default: 'width: 100%', parseHTML: el => `width: 100%; ${el.style.cssText}` },
    'data-type': { default: 'el-form-render' }
  }),
  // renderHTML: ({ node }) => ['iframe', { ...node.attrs }, 0],
  addNodeView: () => createNodeView(e => <Form {...e} />, { syncAttrs: ['src', 'style'] }),
  addCommands() {
    return {
      insertForm: (props) => ({ editor, tr, chain }) => {
        const node = this.type.create({
          ...props,
          src: props?.src ?? `https://huodoushigemi.github.io/el-form-render/demo?sfc=${encodeURIComponent(template)}`
        })
        chain().insertContent(node)
        return true
      }
    }
  }
})

export const menus = []