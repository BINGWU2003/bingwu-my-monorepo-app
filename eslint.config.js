// eslint.config.js - ESLint v9 Flat Config
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // ─── 全局忽略 ────────────────────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/public/**',
      '**/.turbo/**',
      '**/.vitepress/cache/**',
      '**/*.min.js',
      'pnpm-lock.yaml',
      // apps/web 第三方生成文件（iconfont）
      'apps/web/src/assets/iconfont/**',
    ],
  },

  // ─── 基础 JS 推荐规则 ────────────────────────────────────────
  js.configs.recommended,

  // ─── TypeScript 文件 ─────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // TS 已经能处理这些，关闭 js 层面的 no-undef
      'no-undef': 'off',
    },
  },

  // ─── Vue 文件 ────────────────────────────────────────────────
  {
    files: ['**/*.vue'],
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...pluginVue.configs['recommended'].rules,
      ...tsPlugin.configs.recommended.rules,
      // Vue 规则
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index', 'App', '[id]'],
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // TS 已经能处理这些，关闭 js 层面的 no-undef
      'no-undef': 'off',
    },
  },

  // ─── 通用规则（JS 文件） ─────────────────────────────────────
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  // ─── apps/web（pure-admin-thin 模板）宽松规则覆盖 ───────────
  // pure-admin-thin 是第三方模板，保留其原有代码风格，仅在此收紧必要规则
  {
    files: ['apps/web/src/**', 'apps/web/mock/**', 'apps/web/types/**', 'apps/web/build/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': 'off',
    },
  },

  // ─── apps/mobile（vue3-h5-template 模板）宽松规则覆盖 ────────
  {
    files: ['apps/mobile/src/**', 'apps/mobile/mock/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': 'off',
    },
  },

  // ─── Prettier（必须放最后，覆盖格式化规则） ──────────────────
  prettier,
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
];
