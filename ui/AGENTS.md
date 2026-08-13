# 前端协作规则

本文件适用于 `ui/`，并继承仓库根 `AGENTS.md`。开始前端任务前，必须先阅读 `document/development/code-style.md` 和 `document/development/frontend-code-style.md`；后者是前端目录、页面、接口、权限、样式与质量规则的权威细则。

## 应用边界

- `admin-ui/` 与 `customer-ui/` 是完全独立的应用；不得交叉导入源码、共享组件、请求客户端、状态、依赖、锁文件或构建产物。
- 每个应用只使用自身的 `package.json` 与锁文件。未经用户明确授权，不得安装、升级或删除依赖。
- API 调用必须使用各自 `src/utils/request.js` 创建的请求客户端；不得在页面、组件或 store 中另建 Axios 实例、散落配置 `baseURL`、认证头或通用错误处理。

## 开发模板

- 管理端 CRUD 按 `frontend-code-style.md` 的“管理端 CRUD 开发模板”实现：API 位于 `src/api/<domain>/`，页面位于 `src/views/<domain>/<resource>/`，并保持查询、表格、分页、表单、权限和导出的既定组织方式。
- 用户端使用自身的语义化 HTML、项目样式和轻量组件；不得引入或复制管理端的 Element Plus 体系。
- 权限字符串、字段名、枚举值和接口路径必须与后端保持一致；前端权限只控制界面展示，不能替代后端鉴权。

## 质量与修改范围

- 只格式化本次触达的文件，禁止对继承的管理端代码或另一个前端应用做无业务意义的全量重排。
- 结束前执行与修改范围相符的非测试检查、生产构建或配置解析，并运行 `git diff --check`。未获用户在当前任务明确授权，不得运行测试。
