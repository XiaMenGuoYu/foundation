# 前端业务协作规则

本文件适用于 `ui/`，并继承仓库根 `AGENTS.md`。Vue、JavaScript、路由、样式、权限指令和质量门禁的技术细则统一维护在 [frontend-code-style.md](../document/development/frontend-code-style.md)，本文件只保留前端应用的业务边界和复用约束。

## 应用边界

- `admin-ui/` 与 `customer-ui/` 是完全独立的应用；不得交叉导入源码、组件、请求客户端、状态、依赖、锁文件或构建产物。
- 每个应用只使用自身的 `package.json` 与锁文件。未经用户明确授权，不得安装、升级或删除依赖。
- API 调用必须使用各自 `src/utils/request.js` 创建的请求客户端；不得在页面、组件或 store 中另建 Axios 实例，或散落配置 `baseURL`、认证头和通用错误处理。

## 业务接口与页面

- 管理端文件和图片上传统一复用仓库根 `AGENTS.md` 定义的 `POST /common/upload`；优先使用现有上传组件，需要编程式上传时复用已有通用 API 封装。
- 管理端页面、API 模块、路由和权限指令按同一业务资源组织；字段名、枚举值、接口路径和权限字符串必须与后端契约一致。
- 前端权限只控制菜单、按钮和页面入口的显示，不得替代后端鉴权或项目数据隔离。
- 用户端只调用公开 API，并保持公开展示所需的安全投影；可选区域请求失败时按接口契约降级，不得泄露管理端鉴权状态、内部配置或敏感字段。
- 用户端使用自身的语义化 HTML、项目样式和轻量组件，不得引入或复制管理端的 Element Plus 组件体系。

## 规范入口

- 任意前端改动：`document/development/code-style.md`。
- Vue、JavaScript、路由、样式、管理端 CRUD 页面和前端质量检查：`document/development/frontend-code-style.md`。
- 涉及 API、权限或数据库字段时，还需读取相应的后端或数据库规范。

## 验证

- 只格式化本次触达的文件，禁止对继承的管理端代码或另一个前端应用做无业务意义的全量重排。
- 管理端至少执行 `npm run build:prod`；用户端按范围执行 `npm run check`、`npm run lint` 和 `npm run build`。
- 管理端当前没有独立的 lint 与 format 脚本，不得虚构检查结果；如全量检查存在继承基线问题，应区分本次新增问题与既有问题。
- 未获用户在当前任务明确授权，不得运行测试。
