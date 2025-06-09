import { build } from 'vite'

build({
  build: {
    emptyOutDir: false,
    lib: {
      entry: ['src/online.tsx', 'src/function.ts'],
      formats: ['es']
    }
  }
})