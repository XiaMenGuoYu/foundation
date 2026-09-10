# 二次开发手册

本文面向在本仓库上新增或调整业务能力的开发成员。目标是帮助成员在不破坏模块边界、数据隔离和既有应用约定的前提下完成端到端开发。

## 1. 项目结构与职责

```text
platform/              RuoYi 3.9.2 基础框架，只读
service/
├── admin/             启动、配置、Web Controller、公开 API 编排
├── business/          领域模型、业务 Service、Mapper、业务校验
├── integration/       第三方系统适配器
└── sql/               版本化迁移与人工回滚说明
ui/
├── admin-ui/          管理端 Vue 3 应用
└── customer-ui/       用户端 Vue 3 应用
document/development/  开发规范与本手册
```

后端依赖只能沿 `admin -> business -> integration` 方向流动：`integration` 不引用 `business`，`business` 不引用 `admin`。管理端 CRUD 的领域逻辑放在 `business`；面向用户端等外部调用方的项目解析、状态过滤、排序、分页、安全投影、响应组装和可选区域降级放在 `admin` 的编排 Service，并复用已有领域 Service。

`admin-ui` 与 `customer-ui` 是两个独立应用。它们不能共享源码、组件、请求客户端、状态、依赖、锁文件或构建产物。

## 2. 开始任务前

1. 阅读根目录 `AGENTS.md`，再读取目标目录最近的 `AGENTS.md`。
2. 阅读 `document/development/code-style.md`，并按影响范围继续阅读后端、前端或数据库细则。
3. 用代码检索确认同领域已有实现、权限字符串、接口路径、DTO/JavaScript 模型和迁移编号，优先复用而非新建平行能力。
4. 新功能、跨模块行为变更、数据结构变更或既有实现偏差修复，先创建或更新 OpenSpec change。工件完成后，必须获得用户明确确认才能修改业务代码、SQL、接口或配置。

OpenSpec 默认使用 `spec-driven`。仅当变更局限于单一模块，且不涉及数据结构、权限安全、事务、第三方集成、跨端契约或方案比较时，才使用 `lite`。所有 OpenSpec 工件使用简体中文。

## 3. 后端开发

### 3.1 管理端 CRUD

管理端 CRUD 使用项目既定的管理端 CRUD 开发模板：

- Controller 放在 `service/admin`，负责路由、入口权限、操作日志与协议适配。
- 领域对象、Mapper、`I...Service` 接口和实现放在 `service/business`；Mapper XML 放在对应资源目录。
- 管理端列表使用 `TableDataInfo`，详情与写操作使用 `AjaxResult`；权限使用 `@PreAuthorize`，新增、修改、删除、导出使用 `@Log`。
- 该模板使用 4 空格、Allman 大括号和 `@Autowired` 字段注入。保持同一文件只使用该模板的格式。

### 3.2 公开 API

公开 API 使用独立的 Request/Response 契约：

- Controller 位于 `service/admin` 的 API 包；Request 与 Response 放在对应子包，不能把持久化实体直接作为公开 API 的入参或出参。
- 公开 API 编排 Service 可以放在 `service/admin`，用构造器注入依赖，并调用 `business` 已有领域 Service。
- 公开接口在边界做结构校验，在编排 Service 再执行项目隔离、状态过滤、权限和业务校验；可选增强失败要安全降级，核心写入失败不能伪装成功。
- 该模板使用 2 空格、K&R 大括号、`private final` 构造器注入、`@Validated` 和明确的 Request/Response 类型。

### 3.3 数据、权限与异常

- 所有项目级查询和写入都显式携带并验证 `projectId` 或已解析的项目上下文；资源查询、更新、删除不能先只按资源 ID 查出后再信任请求中的项目归属。
- Controller 不是唯一安全边界。Service 必须再次校验关键权限、数据范围与项目归属。
- 不使用原始集合、无边界 `Map` 或静默异常代替明确模型。错误响应和日志不能包含密钥、令牌、Cookie、密文、完整 URL 或个人隐私。
- 通用文件上传优先复用 `POST /common/upload`：使用 `multipart/form-data`，字段名为 `file`，成功响应读取 `url` 与 `fileName`。只有契约不能表达独立权限、参数、响应或生命周期时才新建领域上传接口。

## 4. 数据库与迁移

涉及表、列、索引、约束、迁移、Mapper SQL 或数据模型时，先完整阅读 `database-code-style.md`。

- 业务表使用 `bsn_` 前缀，标识符用小写 ASCII `snake_case`，布尔列使用正向命名；索引命名为 `idx_<table>_<columns>` 或 `uk_<table>_<columns>`，MySQL 标识符不超过 64 个字符。
- 不建立物理外键，关联完整性由 Service 保证。仅为明确的筛选、关联和排序访问路径创建索引。
- 迁移使用 `service/sql/VNNN__*.sql`；同时在 `service/sql/rollback/` 提供人工回滚说明。不要自动执行迁移、回滚、清库或数据修复脚本。
- 列表和普通详情不要投影大字段、密文或敏感配置；动态 SQL 使用参数绑定，禁止 `${}` 拼接外部输入。

## 5. 前端开发

### 5.1 管理端

- 技术栈为 Vue 3、Vite、JavaScript、Vue Router、Pinia、Element Plus 和 Axios。业务接口通过 `src/utils/request.js` 发起，API 文件放在 `src/api/<domain>/`，页面放在 `src/views/<domain>/<resource>/`。
- 管理端 CRUD 页面保持查询表单、权限工具栏、`right-toolbar`、加载态表格、分页和新增/修改共用弹窗的组织方式。查询重置到第一页；保存、删除或状态变更成功后按当前条件刷新列表。
- API 方法按 `listXxx`、`getXxx`、`addXxx`、`updateXxx`、`delXxx` 命名；查询放 `params`，写操作放 `data`。权限字符串、请求路径、字段和导出路径必须与后端一致。
- 页面内的查询条件、弹窗开关、表单草稿和选择状态留在页面；Pinia 只保存真正跨路由共享的状态。前端权限仅影响可见性，后端仍是可信边界。

### 5.2 用户端

- 技术栈为 Vue 3、Vite、JavaScript、Vue Router、Pinia、Axios、SCSS 和轻量提示组件，不使用 Element Plus。
- 使用自身的 `src/utils/request.js`、路由、状态和样式体系。需要认证的页面通过 `meta.requiresAuth` 与既有守卫接入，不在组件中散落令牌判断。
- 公开页面优先使用语义化 HTML、项目设计 token 与局部组件。环境差异使用 `import.meta.env.VITE_*`，不得写入生产域名凭据、令牌或 Cookie。

## 6. 端到端变更清单

新增或修改一个业务能力时，按以下顺序核对：

1. 明确业务场景、访问端、项目上下文、权限、失败行为与是否需要 OpenSpec。
2. 如涉及数据模型，设计表、索引、迁移与人工回滚说明。
3. 在 `business` 实现领域模型、Mapper、Service 和业务校验；外部编排放入 `admin`。
4. 定义稳定 API 契约，保证 DTO、字段、枚举、权限字符串与前端模型同步。
5. 在相应前端应用新增 API 模块、路由页面或组件，复用其请求客户端与权限机制。
6. 检查项目隔离、敏感字段投影、异常响应、空状态、加载态、失败提示和删除确认。
7. 按变更范围更新 OpenSpec 任务和相关开发文档，完成静态检查与构建验证。

## 7. 本地配置与质量验证

运行参数以各模块当前的 `application*.yml`、`.env*`、`package.json` 和部署配置为准；配置中只引用环境变量或安全配置源，不提交真实凭据。

未经当前任务的明确授权，不运行任何测试。推荐的非测试验证命令：

```powershell
mvn.cmd -f service/pom.xml spotless:check
mvn.cmd -f service/pom.xml "-Dmaven.test.skip=true" package

Set-Location ui/admin-ui
yarn build:prod

Set-Location ui/customer-ui
npm run check
npm run lint
npm run build

git diff --check
```

只格式化本次触达的文件。安装或升级依赖、访问网络、启动服务、执行数据库脚本、发布、推送和归档都需要用户明确授权。

## 8. 交付前自查

- 变更没有写入 `platform/`，也没有清理或重排无关文件。
- 代码、SQL、API、前端模型、权限、枚举与文档一致。
- 项目隔离、Service 防御性校验、安全投影与日志脱敏已覆盖。
- 已执行适用的非测试检查或生产构建，并运行 `git diff --check`。
- 如有 OpenSpec change，任务按事实勾选并通过 `openspec validate <change-id> --strict`；未获单独授权不归档、提交或推送。
