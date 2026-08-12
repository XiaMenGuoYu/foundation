# 前端代码规范

本文定义 `ui/admin-ui/` 与 `ui/customer-ui/` 的实现规范。开始前端任务前，必须先阅读 [code-style.md](code-style.md)，再阅读本文；涉及 API、权限、富文本或媒体上传时，还必须阅读对应的后端、数据库或安全约束。

本文以两个前端当前的真实技术基线为依据。管理端 CRUD 以第 10 节的开发模板为正式规范；该模板与通用规则冲突时，以模板为准。其他存量实现不是自动适用的目标标准；需要大规模迁移时必须另立 OpenSpec change。

## 1. 应用边界与技术基线

### 1.1 管理端

- `ui/admin-ui/` 是独立的 Vue 3 单页应用，使用 Vite、ESM、JavaScript、Vue Router、Pinia、Element Plus 和 Axios。
- 管理端已配置 `unplugin-auto-import` 自动导入 Vue、Vue Router 与 Pinia 的公开 API。本地模块、业务 API、组件和第三方依赖仍必须显式导入。
- 管理端使用 `@` 指向 `src/`。不得跨越应用目录引用 `ui/customer-ui/` 的源码、依赖、构建产物或运行时状态。
- 管理端默认使用 Element Plus 完成后台表单、表格、弹窗、上传和消息反馈；非必要不得引入第二套后台组件库。

### 1.2 用户端

- `ui/customer-ui/` 是独立的 Vue 3 单页应用，使用 Vite、ESM、JavaScript、Vue Router、Pinia、Axios、NProgress、SCSS 与自定义轻量提示组件。
- 用户端同样通过 `unplugin-auto-import` 自动导入 Vue、Vue Router 与 Pinia 的公开 API；业务 API、页面组件、store、工具和第三方依赖必须显式导入。
- 用户端不依赖 Element Plus。工具导航、资讯与广告等公开页面优先使用语义化原生元素、项目设计 token 与局部组件；不得为了方便复制管理端的 Element Plus、全局组件或样式体系。
- 用户端使用 `@` 指向 `src/`，自身维护入口、路由、请求客户端、store、依赖清单和锁文件；不得与管理端交叉导入或共享运行时状态。
- 用户端当前开发服务端口为 `81`。代理地址、站点标题等环境差异统一使用 Vite 的 `import.meta.env.VITE_*`，不得将生产域名、密钥、令牌、Cookie 或环境专属路径写入源码。

### 1.3 依赖与构建

- 每个前端仅使用自己的依赖清单和锁文件。新增、升级或删除依赖必须说明用途、版本范围和替代方案，不得为单个页面引入重量级框架。
- 两端当前均使用 `package-lock.json`，日常依赖管理使用 npm；不得混入另一种包管理器的锁文件。
- 用户端的构建、静态检查和格式化脚本分别为 `npm run build`、`npm run lint`、`npm run check` 与 `npm run format`；`format` 是写入命令，只能格式化本次触达的文件。

## 2. 目录与职责

### 2.1 管理端目录

```text
ui/admin-ui/src/
├── api/          按业务域封装 HTTP 调用
├── assets/       全局样式、静态资源与图标
├── components/   可复用、业务无关或跨页面组件
├── directive/    权限等通用指令
├── layout/       后台应用壳与布局组件
├── plugins/      框架级插件与受控全局能力
├── router/       常量路由与动态路由定义
├── store/        仅跨页面共享的 Pinia store
├── utils/        无界面、无页面状态的通用能力
└── views/        路由页面，按业务域组织
```

### 2.2 用户端目录

```text
ui/customer-ui/src/
├── api/          按公开业务域封装 HTTP 调用
├── assets/       全局样式、图片、SVG 与设计 token
├── components/   可复用的展示与交互组件
├── layout/       站点页头、页脚和页面框架
├── plugins/      Toast 等受控全局能力
├── router/       静态路由、路由元信息与守卫
├── store/        登录用户等确有跨页需求的 Pinia store
├── utils/        请求、认证、加密等无界面通用能力
└── views/        首页、项目页、工具页、资讯页等路由页面
```

- `main.js` 只负责创建应用、注册路由、Pinia、必要插件、全局组件和全局样式；不得承载业务逻辑。
- `App.vue` 只承载应用根结构；管理端页面壳放在 `layout/`，用户端站点框架同样放在 `layout/`，页面业务放在 `views/`。
- API 文件按业务域放在 `api/<domain>/` 或既有等价目录。API 模块不得包含 DOM、提示弹窗、路由跳转或页面状态修改。
- 路由页面入口可沿用既有 `index.vue` 约定；仅限路由目录中的入口文件。新增可复用组件使用多单词 PascalCase 文件名。
- 页面私有子组件放在页面相邻目录或页面专属目录；只有被多个页面复用且不依赖页面状态时，才提升至 `components/`。
- `utils/` 不得成为无边界杂物目录。跨业务规则、页面状态或 UI 反馈不得伪装成工具函数。

## 3. Vue 组件与页面实现

- 新增或实质修改的页面默认使用 Vue 3 Composition API 与 `<script setup>`；除框架兼容或迁移约束外，不新增 Options API 页面。
- 组件名称表达业务角色。`props` 使用正向、可读名称；`emits` 使用明确的 `update:x` 或事件语义；不得直接修改 props。
- 每个 `v-for` 必须使用稳定、唯一且与展示顺序无关的 `:key`。不得在同一元素组合 `v-if` 与 `v-for`。
- 模板只负责声明结构和绑定，不得堆叠复杂转换、权限判断或请求逻辑；派生状态放入 `computed`，副作用放入命名明确的处理函数或 `watch`。
- `computed` 必须无副作用；`watch` 只用于副作用，不得替代可计算状态。监听器、Observer 和定时器必须在组件卸载时清理。
- 默认使用 `const`；仅在确需重新赋值时使用 `let`；禁止 `var`。使用 `===` 与 `!==`，不依赖隐式类型转换。
- 不得新增静默 `catch`、悬空 Promise 或无上下文的 `console` 输出。异步调用必须 `await`、返回，或由明确的错误边界处理；管理端 CRUD 的删除确认可按第 10 节模板使用 `catch(() => {})` 忽略用户主动取消。

## 4. 状态、表单与列表

- Pinia 仅保存登录用户、权限、全局布局、字典缓存和确有跨路由需求的状态。页面查询条件、弹窗开关、表单草稿和列表选择状态默认留在页面组件。
- Store 使用 `useXxxStore` 命名，state 只保存数据；数据加载、错误处理和持久化边界必须清晰。基础组件不得直接依赖页面级 store。
- 管理端列表页必须明确维护加载态、查询条件、分页、列表数据和总数。发起新查询时必须将页码重置到第一页；删除、状态变更或保存成功后必须按当前查询条件刷新。
- 表单初始值必须由单独的 `reset` 或工厂函数产生，避免复用对象引用。提交前执行字段校验，提交成功后关闭弹窗、重置状态并刷新关联列表。
- 高风险操作必须先确认；批量操作在无选择时必须禁用。前端权限仅改善界面可见性，后端权限校验仍是唯一可信边界。

## 5. API、请求与错误处理

- 管理端所有 HTTP 调用必须通过 `ui/admin-ui/src/utils/request.js` 创建的请求客户端；用户端所有 HTTP 调用必须通过 `ui/customer-ui/src/utils/request.js` 创建的请求客户端。页面、组件和 store 不得自行创建 Axios 实例或散落配置 `baseURL`、认证头和通用错误处理。
- API 形参使用具名对象或语义明确的标识符。查询参数使用 `params`，请求体使用 `data`；不得拼接未经编码的外部输入到 URL 或请求头。
- 认证、重复提交保护、通用响应码、下载和全局反馈由各自应用的请求层或既有受控插件处理。新业务不得绕过这些边界。
- 用户端的未认证处理必须保留安全的登录跳转与原始目标地址；新增受保护页面必须通过 `requiresAuth` 路由元信息和既有守卫接入，而不是在组件中零散判断令牌。
- 页面负责将可预期的业务结果反馈给用户；请求层负责网络、认证和通用协议错误。错误消息不得回显密钥、令牌、富文本原文、广告代码或用户隐私。
- 未知外部响应必须在业务边界校验后使用。当前两端均为 JavaScript 项目，复杂响应应采用明确的守卫函数或 JSDoc 契约；不得用无边界对象访问掩盖字段缺失。

## 6. 路由、菜单与权限

- 管理端常量路由定义在 `router/`；由后台权限加载的路由必须沿用既有动态路由与权限生成机制，不得在页面中临时注册路由。菜单、页面与操作权限字符串必须与后端一致。
- 管理端详情、编辑和授权等隐藏页面必须配置正确的返回路径与 `activeMenu`，避免菜单高亮和缓存异常。`v-hasPermi` / `v-hasRole` 必须传入非空、受控的权限或角色数组。
- 用户端路由统一定义在 `ui/customer-ui/src/router/`。公开页面默认可访问；仅账户或后续需要认证的页面设置 `meta.requiresAuth`。守卫统一维护加载进度、页面标题、白名单和登录跳转。
- 新增公开资源、推广链接或嵌入内容不得借用管理端认证路由。两个应用的路由守卫、请求客户端和错误页面各自维护。

## 7. 富文本、上传与外部内容

- 富文本编辑仅用于确有运营编辑需求的字段。保存前和展示前的净化责任必须明确；不得使用 `v-html` 渲染未经净化的内容。
- 管理端上传优先复用既有 `FileUpload`、`ImageUpload`、`ImagePreview` 或经确认的统一上传能力，在客户端校验类型、大小和数量；客户端校验不是安全边界。
- 用户端当前没有上传或富文本编辑器能力。公开展示需要新增媒体处理、富文本渲染或上传流程时，必须先明确净化、缓存、失败降级与安全边界，不得直接复制管理端组件。
- 外部链接必须使用允许的协议；新窗口跳转使用安全属性。iframe 必须最小化 `sandbox`、限制 referrer，并验证 `postMessage` 来源。

## 8. 样式、组件库与可访问性

- 全局 token、重置和管理端 Element Plus 覆盖集中在各自的 `assets/styles/`。页面和组件样式默认使用 `<style scoped>`、CSS Modules 或清晰的 BEM 边界。
- 管理端优先使用 Element Plus 的组件、栅格、校验和反馈机制；用户端优先使用项目自有样式、语义化 HTML 和小型可复用组件，不得用大量全局样式模拟另一套组件库。
- 类名表达结构或组件职责，不得以偶然位置、颜色或尺寸命名。选择器嵌套不超过 3 层；禁止 `!important`，除非覆盖不可控第三方内联样式且有中文原因注释。
- 表单控件必须有可见标签或等效可访问名称；图标按钮必须提供提示；状态不能只依赖颜色表达；动画必须尊重 `prefers-reduced-motion`。
- 响应式布局使用统一断点或设计 token。页面在窄屏下必须可操作，不得以固定宽度裁剪表单、列表操作、工具卡片或资讯内容。

## 9. 格式、静态检查与构建

- JavaScript、Vue、CSS、SCSS、JSON 与配置文件使用 2 空格缩进；文本文件使用 UTF-8、LF 换行并以单个换行符结尾。管理端 CRUD 页面内的字符串引号、组件属性换行与 Promise 链式调用遵循第 10 节模板；其余文件遵循各自可用的 Prettier 配置。
- Prettier 负责格式，ESLint 负责语义规则；不得让 ESLint 重复纯格式规则。两端 Prettier 基线为 `singleQuote: true`、`semi: false`、`printWidth: 100`、`trailingComma: none`、`vueIndentScriptAndStyle: false`。
- 用户端已采用 ESLint flat config 与 `eslint-plugin-vue` recommended 基线。新增规则必须保持可执行、可解释，不能为了消除存量告警而全局关闭语义规则。
- `lint` 必须是非修改命令，`check` 不得隐式执行测试或 `--fix`。格式化只作用于本次触达文件，不进行无业务意义的全量重排。
- 当前 `admin-ui` 的 `package.json` 尚未提供规范要求的格式或 lint 脚本；这是待补齐的工程能力，不构成跳过质量门禁的理由。补齐时应单独评估并同步更新脚本与配置。
- 交付前至少执行适用的格式检查、静态检查或生产构建，并运行 `git diff --check`。是否执行测试仍以当前任务的明确授权为准。

## 10. 管理端 CRUD 开发模板

管理端业务列表、详情、新增、修改、删除与导出页面使用以下组织方式与交互模式；规则独立于任何具体业务功能或示例文件。

- API 文件位于 `ui/admin-ui/src/api/<domain>/<resource>.js`，显式从 `@/utils/request` 导入请求客户端。列表、详情、新增、修改、删除分别使用 `listXxx`、`getXxx`、`addXxx`、`updateXxx`、`delXxx` 命名；查询通过 `params` 传递，写操作通过 `data` 传递，URL 与后端路径一一对应。
- 路由页面位于 `ui/admin-ui/src/views/<domain>/<resource>/index.vue`，使用 `<script setup name="Xxx">`、`getCurrentInstance()` 取得 `proxy`、`ref` 保存页面状态、`reactive` 组织 `form`/`queryParams`/`rules`，并通过 `toRefs` 暴露响应式字段。
- 页面包含查询表单、带 `v-hasPermi` 的新增/修改/删除/导出工具栏、`right-toolbar`、带加载态与选择事件的 `el-table`、`pagination` 和新增/修改共用的 `el-dialog`。列表请求由 `getList` 统一维护加载态、列表数据与总数；查询重置页码，保存或删除成功后重新加载列表。
- 表单通过 `reset` 生成初始值并调用 `proxy.resetForm` 清理校验状态；新增与修改共用 `submitForm`，操作成功后关闭弹窗、显示成功提示并刷新列表。删除使用 `proxy.$modal.confirm(...).then(...).then(...).catch(() => {})`，仅将最后的空 catch 用于用户取消确认。
- 列表与操作按钮的权限字符串、请求路径和导出路径必须与后端管理端 CRUD 一致。前端权限仅控制界面展示，不能替代后端 `@PreAuthorize`。
