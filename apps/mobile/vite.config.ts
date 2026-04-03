import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, 'env');
  const env = loadEnv(mode, envDir, '');
  return {
    envDir,
    base: env.VITE_PUBLIC_PATH || '/',
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dts: 'src/typings/auto-imports.d.ts',
      }),
      Components({
        dts: 'src/typings/components.d.ts',
        resolvers: [VantResolver()],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
      }) as any,
      createHtmlPlugin({
        inject: {
          data: {
            ENABLE_ERUDA: env.VITE_ENABLE_ERUDA || 'false',
          },
        },
      }) as any,
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@bingwu-my-monorepo/shared': path.resolve(__dirname, '../../packages/shared/src'),
        '@bingwu-my-monorepo/components': path.resolve(__dirname, '../../packages/components/src'),
        '@bingwu-my-monorepo/shared-types': path.resolve(
          __dirname,
          '../../packages/shared-types/src'
        ),
        '@bingwu-my-monorepo/shared-schemas': path.resolve(
          __dirname,
          '../../packages/shared-schemas/src'
        ),
      },
    },
    server: {
      host: true,
      port: 3002,
      proxy: {
        '/dev-api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:4000',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/dev-api/, '/api'),
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  };
});
