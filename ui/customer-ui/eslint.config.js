import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

// unplugin-auto-import 自动注入的 API，与 vite/plugins/auto-import.js 的 imports 保持一致
const autoImportGlobals = {
  ref: 'readonly',
  reactive: 'readonly',
  computed: 'readonly',
  watch: 'readonly',
  watchEffect: 'readonly',
  onMounted: 'readonly',
  onUnmounted: 'readonly',
  onBeforeMount: 'readonly',
  onBeforeUnmount: 'readonly',
  nextTick: 'readonly',
  toRef: 'readonly',
  toRefs: 'readonly',
  unref: 'readonly',
  provide: 'readonly',
  inject: 'readonly',
  defineComponent: 'readonly',
  defineProps: 'readonly',
  defineEmits: 'readonly',
  defineExpose: 'readonly',
  defineOptions: 'readonly',
  withDefaults: 'readonly',
  getCurrentInstance: 'readonly',
  useRoute: 'readonly',
  useRouter: 'readonly',
  onBeforeRouteLeave: 'readonly',
  onBeforeRouteUpdate: 'readonly',
  defineStore: 'readonly',
  storeToRefs: 'readonly',
  createPinia: 'readonly'
}

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...autoImportGlobals
      }
    },
    rules: {
      // 路由页面沿用 index.vue 约定，组件命名靠审查保证
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 模板格式统一交给 Prettier，ESLint 不重复纯格式规则
      'vue/max-attributes-per-line': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off'
    }
  }
]
