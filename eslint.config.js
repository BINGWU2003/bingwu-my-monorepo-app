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
      'apps/web/src/assets/**',
      'apps/web/src/**/iconfont/**',
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
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index', 'App', '[id]'],
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
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

  // ─── apps/web 自定义类型全局变量 ─────────────────────────────
  {
    files: ['apps/web/src/**', 'apps/web/types/**', 'apps/web/build/**'],
    languageOptions: {
      globals: {
        RefType: 'readonly',
        EmitType: 'readonly',
        TargetContext: 'readonly',
        ComponentRef: 'readonly',
        ElRef: 'readonly',
        ForDataType: 'readonly',
        AnyFunction: 'readonly',
        PropType: 'readonly',
        Writable: 'readonly',
        Nullable: 'readonly',
        NonNullable: 'readonly',
        Recordable: 'readonly',
        ReadonlyRecordable: 'readonly',
        Indexable: 'readonly',
        DeepPartial: 'readonly',
        Without: 'readonly',
        Exclusive: 'readonly',
        TimeoutHandle: 'readonly',
        IntervalHandle: 'readonly',
        Effect: 'readonly',
        ChangeEvent: 'readonly',
        WheelEvent: 'readonly',
        ImportMetaEnv: 'readonly',
        Fn: 'readonly',
        PromiseFn: 'readonly',
        ComponentElRef: 'readonly',
        parseInt: 'readonly',
        parseFloat: 'readonly',
      },
    },
  },

  // ─── apps/web（pure-admin-thin 模板）宽松规则覆盖 ───────────
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
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  // ─── apps/web .d.ts 文件宽松规则 ────────────────────────────
  {
    files: ['apps/web/**/*.d.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },

  // ─── apps/web .js 文件宽松规则 ──────────────────────────────
  {
    files: ['apps/web/**/*.?([cm])js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // ─── apps/web Vue 文件额外规则 ──────────────────────────────
  {
    files: ['apps/web/**/*.vue'],
    languageOptions: {
      globals: {
        $: 'readonly',
        $$: 'readonly',
        $computed: 'readonly',
        $customRef: 'readonly',
        $ref: 'readonly',
        $shallowRef: 'readonly',
        $toRef: 'readonly',
      },
    },
    rules: {
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/no-setup-props-reactivity-loss': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
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
