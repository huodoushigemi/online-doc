import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: './',
  build: {
    outDir: 'docs',
    assetsDir: './',
  },
  plugins: [
    solid(),
    (await import('unocss/vite')).default({
      content: {
        pipeline: {
          include: ["src/**/*.{js,ts,tsx}"],
        },
      },
      presets: [
        (await import('@ameinhardt/unocss-preset-daisy')).presetDaisy({ base: true, utils: true, logs: true, styled: true }),
        (await import('unocss/preset-wind4')).default({ dark: 'media', preflights: { reset: false, theme: true } }),
        (await import('unocss/preset-attributify')).default(),
      ],
      transformers: [
        (await import('@unocss/transformer-directives')).default(),
        (await import('unocss')).transformerVariantGroup(),
      ],
      shortcuts: {
        aic: 'items-center',
      },
    }),
    (await import('unplugin-auto-import/vite')).default({
      dts: './src/types/auto-imports.d.ts',
      resolvers: [(await import('unplugin-icons/resolver')).default({ extension: 'jsx', customCollections: ['my'] })]
    }),
    (await import('unplugin-icons/vite')).default({
      autoInstall: true,
      compiler: 'solid',
      customCollections: {
        my: (await import('unplugin-icons/loaders')).FileSystemIconLoader('src/assets')
      }
    })
  ],
})
