import { build } from 'vite'

build({
  build: {
    emptyOutDir: false,
    outDir: 'docs',
    minify: true,
    lib: {
      // entry: ['src/online.tsx', 'src/function.tsx'],
      entry: ['src/components/DataTable/xxx.tsx'],
      formats: ['es']
    }
  }
})