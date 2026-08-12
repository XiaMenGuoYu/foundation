#  仓库协作规则

本文件是系统的仓库级 Codex 指令。进入子目录工作时，还必须读取并遵守距离目标文件最近的 `AGENTS.md`；子目录规则只补充或收紧本文件。

## 仓库边界

- `platform/` 是 RuoYi 3.9.2 基础框架，默认只读； 系统业务代码不得写入其中。
- 后端依赖方向固定为 `service/admin -> service/business -> service/integration`。
- `service/admin/` 承载启动、配置、Web Controller、Web 层异常映射，以及公开 API 的编排 Service；管理端 CRUD 的领域 Service 保持在 `service/business/`。面向外部调用方的服务编排（本次为 customer-ui）的项目解析、状态过滤、排序、分页、安全投影、响应组装和可选区域降级必须在 admin 编排 Service 内完成，并直接复用已有领域 Service。
- `service/business/` 承载领域模型、Service、权限防御、Mapper 与业务校验；不得为面向外部调用方的服务编排新增仅做编排、转发或 DTO 投影的专用 Service，避免与 admin 编排层重复。
- `service/integration/` 承载第三方平台等适配器，不反向依赖业务模块。
- `ui/admin-ui/` 与 `ui/customer-ui/` 是独立前端，不共享构建产物、依赖管理器或运行时状态。
- 保留用户和其他任务已有的未提交修改；不得为了当前任务清理、重置或批量重排无关文件。

## OpenSpec 工作流

- 新功能、跨模块行为变更、数据结构变更和既有实现偏差修复，必须先创建或更新独立 OpenSpec change。
- OpenSpec change 的 proposal、design、tasks 与全部 delta specs 的标题、正文、任务、需求和场景必须使用简体中文；仅保留必要的代码标识符、命令、协议字段和 RFC 关键字原文。
- 实现前完整阅读该 change 的 `proposal.md`、`design.md`、`tasks.md` 和全部 delta specs。
- 完成或更新 change 的 proposal、design、tasks 和全部 delta specs 后，开始实施前必须取得用户在当前对话中的明确确认；未确认时仅可创建或更新 OpenSpec 文档、阅读和诊断，不得修改业务代码、SQL、接口或配置。
- 按 `tasks.md` 顺序推进；每项真正完成并完成相应静态核验后立即勾选，禁止提前批量勾选。
- 发现设计遗漏时先同步 change 文档，再继续实现，确保 proposal、design、specs 与 tasks 一致。
- 完成后运行 `openspec validate <change-id> --strict`，并按事实更新总交付计划。
- 未经用户明确要求，不得归档 change；归档不等同于实现完成。

## 通用实现原则

- 先查找同领域现有实现和约定，再新增文件；优先复用公共能力，避免复制服务、DTO、类型或常量。
- 变更保持最小、内聚，不顺带重构不相关模块，不用框架层修改掩盖业务层设计问题。
- 命名使用清晰英文；面向用户的提示、业务异常、业务注释和项目文档使用简体中文。
- 包名已经表达场景或访问范围时，类名不得重复添加 `Public`、`Api` 等上下文前缀；类名使用“业务 + 动作 + 角色”，例如 `NewsQueryRequest`，而不是 `PublicNewsQueryRequest`。
- 注释只保留必要信息：公开接口方法说明契约与约束，DTO/模型属性说明业务含义或取值约束，核心逻辑说明非显然的隔离、过滤、降级或安全决策；不得为可由类名、方法名或类型直接推断的内容添加重复注释。
- 不用 `any`、原始集合、静默吞错或无边界的通用 Map 代替明确模型；确需动态结构时必须在边界处校验。
- Controller 只做协议适配，权限、项目隔离和关键校验必须在 Service 再防御一次。
- 所有项目级查询和写入必须显式携带并校验 `projectId` 或已解析的项目上下文，不能信任前端传入的归属关系。
- 对公开接口采用失败安全：可选增强故障不得阻塞正文；降级日志不得包含凭据、密文、广告代码或用户隐私。
- 不写入真实账号、密钥、令牌、Cookie、生产域名凭据或个人数据；配置只引用环境变量。

## 数据模型前置门禁

- 只要任务会新增、修改或评审表、列、索引、约束、迁移、Mapper SQL 或数据模型，就必须先完整阅读 `document/development/code-style.md` 和 `document/development/database-code-style.md`。
- 本门禁同样适用于尚未编写 SQL 的 OpenSpec `proposal.md`、`design.md`、specs 与 code review；不得以“仅修改文档”或“尚未实现”为由跳过。
- 完成数据模型设计前，必须确认业务表使用 `bsn_` 前缀、标识符使用小写 ASCII `snake_case`、布尔列使用正向命名、索引分别使用 `idx_<table>_<columns>` / `uk_<table>_<columns>` 命名，且所有 MySQL 标识符不超过 64 个字符。
- 数据模型必须明确列出查询过滤、关联与排序依据，并仅为这些已知访问路径设计索引；不建立物理外键，关联完整性由 Service 保证。
- 创建或更新涉及数据模型的 OpenSpec change 时，`tasks.md` 的第一项必须是阅读并确认上述两份规范；交付说明必须明确已完成此项前置检查。

## 数据库与接口

- SQL 使用 `service/sql/VNNN__*.sql` 版本化；同时提供 `service/sql/rollback/` 下的人工回滚说明。
- 业务表不建立物理外键，由 Service 保证关联完整性；必须提供必要的唯一约束、查询索引和中文注释。
- 大字段、密文和敏感配置不得进入普通列表投影或普通详情响应。
- API、Java DTO 与 JavaScript 数据模型应同步修改；权限字符串、枚举值和字段名必须端到端一致。
- 不自动执行迁移、回滚、清库或数据修复脚本。

## 格式与质量入口

- 目标代码标准以 `document/development/code-style.md` 为准；现有代码不得反向定义标准。
- Java 17；管理端 CRUD 与公开 API 分别遵循 `document/development/backend-code-style.md` 定义的开发模板。当前 `service/` 的 Spotless 仍使用 Google Java Format AOSP profile，禁止在普通业务变更中全量重排。
- 管理端和公开端以各自 `.prettierrc.json` 执行前端格式化，并使用 ESLint flat config 做语义检查。
- 只格式化本次触达的前端文件，避免对继承的 RuoYi 管理端做无业务意义的全量重排。
- 结束前至少执行适合变更范围的静态检查、生产构建或配置解析，并运行 `git diff --check`。

推荐命令：

```powershell
mvn.cmd -f service/pom.xml spotless:check
mvn.cmd -f service/pom.xml "-Dmaven.test.skip=true" package

Set-Location ui/admin-ui
yarn format:check
yarn lint
yarn build:prod

Set-Location ui/customer-ui
npm run check
npm run lint
npm run build
```

管理端继承代码可能存在已知 JavaScript 与 ESLint 基线错误。不得把全量 `lint` 失败伪报为本次变更失败或通过；需要区分本次新增错误和既有错误，并以生产构建为当前门禁。

## 测试与外部操作

- 默认禁止执行任何测试用例。只有用户在当前任务中明确授权后，才能运行 Maven test、Vitest 或任何测试脚本。
- 未授权时，Maven 生产构建必须使用 `"-Dmaven.test.skip=true"`，确保不编译也不执行测试。
- 安装依赖、访问网络、启动服务、写入工作区外目录、执行数据库脚本、关机、发布、推送和归档都需要明确授权或属于用户已明确要求的范围。
- 不使用 `git reset --hard`、`git clean`、强制推送或递归删除来处理普通开发问题。

## Code Review Rules

- 优先报告权限绕过、项目数据串读、敏感信息泄露、公开接口缓存错误、SSR 崩溃、迁移不可回滚和破坏性兼容问题。
- 发现问题时给出具体文件、触发条件、影响和最小安全修复；不要只评论格式问题。
- 核对实现是否满足当前 OpenSpec scenario，而不只检查代码是否能编译。
- 不要求通过修改 `platform/`、关闭校验或放宽安全边界来消除业务模块错误。

## 完成定义

- 代码、SQL、API 类型、文档和 OpenSpec 任务相互一致。
- 没有真实凭据、无关重排、未说明的依赖或未授权测试。
- 适用的非测试检查和生产构建已执行，失败项与既有基线已准确说明。
- OpenSpec 严格校验通过；是否归档由用户单独决定。
