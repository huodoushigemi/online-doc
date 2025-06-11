import { build } from 'vite'

build({
  build: {
    emptyOutDir: false,
    outDir: 'docs/assets',
    lib: {
      entry: ['src/online.tsx', 'src/function.tsx'],
      formats: ['es']
    }
  }
})