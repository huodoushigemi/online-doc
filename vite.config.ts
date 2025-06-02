import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    solid(),
    (await import('unocss/vite')).default({
      presets: [
        (await import('unocss/preset-wind3')).default({ dark: 'media' }),
        (await import('unocss/preset-attributify')).default(),
      ],
      transformers: [
        (await import('@unocss/transformer-directives')).default(),
        (await import('unocss')).transformerVariantGroup(),
      ],
      shortcuts: {
        aic: 'items-center',
      }
    }),
    (await import('unplugin-auto-import/vite')).default({
      dts: './src/types/auto-imports.d.ts',
      resolvers: [(await import('unplugin-icons/resolver')).default({ extension: 'jsx' })]
    }),
    (await import('unplugin-icons/vite')).default({ autoInstall: true, compiler: 'solid' })
  ],
})
