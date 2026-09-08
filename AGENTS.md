# 仓库协作规则

本文件只定义整个仓库共同遵守的协作流程和安全边界。进入子目录工作时，还必须读取并遵守距离目标文件最近的 `AGENTS.md`；子目录规则只补充或收紧本文件。

## 规则分层

- 技术开发规范统一放在 `document/development/`：`code-style.md` 是入口，后端、前端和数据库分别以对应细则为准。
- 后端业务模块职责、项目隔离和通用后端能力放在 `service/AGENTS.md`。
- admin-ui 与 customer-ui 的业务边界和接口复用放在 `ui/AGENTS.md`。
- `platform/AGENTS.md` 约束 RuoYi 基础框架；`platform/` 默认只读，系统业务代码不得写入其中。
- 保留用户和其他任务已有的未提交修改；不得为当前任务清理、重置或批量重排无关文件。

## 通用接口复用

- 管理端通用文件上传接口为 `POST /common/upload`，请求使用 `multipart/form-data`，文件字段名为 `file`，成功响应提供 `url` 与 `fileName`。
- 新增文件或图片上传需求时，必须先复用上述接口，不得新增请求、响应和业务语义与其重叠的领域上传接口。
- 只有通用接口契约无法表达独立权限、请求参数、响应数据或业务生命周期时，才允许新增领域上传接口，并必须说明契约差异。

## OpenSpec 工作流

- 新功能、跨模块行为变更、数据结构变更和既有实现偏差修复，必须先创建或更新独立 OpenSpec change。
- 默认使用 `spec-driven` schema。只有变更局限于单一模块，且不涉及数据结构或迁移、权限与安全边界、事务一致性、第三方集成、跨端契约或需要比较的技术方案时，才可使用 `lite` schema；用户明确指定 schema 时从其要求。
- `lite` 只包含 proposal、specs 与 tasks，适用于文案、样式、简单页面交互或局部兼容性修复；中大型和高风险变更必须使用包含 design 的 `spec-driven`。不得为了减少工件而拆分或隐瞒实际影响范围。
- 创建或更新 OpenSpec change 前，必须按预计影响范围加载对应规则：涉及后端时读取 `service/AGENTS.md`、`document/development/code-style.md` 和 `document/development/backend-code-style.md`；涉及 admin-ui 或 customer-ui 时读取 `ui/AGENTS.md`、`document/development/code-style.md` 和 `document/development/frontend-code-style.md`；涉及表结构、迁移、Mapper SQL 或数据模型时还必须读取 `document/development/database-code-style.md`。
- 上述规则中的模块边界、业务约束、接口复用、权限、数据隔离、命名、迁移和质量门禁必须落实到当前 schema 实际包含的工件；不得只记录“已阅读”而继续生成与规范冲突的设计。
- 当前 schema 的全部工件使用简体中文；只保留必要的代码标识符、命令、协议字段和 RFC 关键字原文。
- 实现前必须完整阅读该 change 的全部现有工件。
- 工件完成或更新后，开始实施前必须取得用户在当前对话中的明确确认；未确认时只能修改 OpenSpec 文档、阅读和诊断。
- 按 `tasks.md` 顺序实施；每项真正完成并完成对应静态核验后立即勾选，禁止提前批量勾选。
- 发现计划遗漏时先同步 change 工件，再继续实施，保证当前 schema 的全部工件一致。
- 完成后运行 `openspec validate <change-id> --strict`。未经用户明确要求不得归档 change。

## 数据模型前置门禁

- 任何新增、修改或评审表、列、索引、约束、迁移、Mapper SQL 或数据模型的任务，必须先完整阅读 `document/development/code-style.md` 和 `document/development/database-code-style.md`。
- 该门禁同样适用于 OpenSpec 数据模型设计和 code review，不得以“仅修改文档”或“尚未实现”为由跳过。
- 涉及数据模型的 OpenSpec `tasks.md` 第一项必须记录上述规范检查；迁移、回滚、清库和数据修复脚本不得自动执行。

## 通用实施与安全

- 先检索同领域实现和公共能力，再新增文件；变更保持最小、内聚，不顺带重构无关模块。
- API、Java DTO、JavaScript 模型、权限、枚举和字段名必须端到端一致。
- 不使用无边界动态类型、原始集合、静默吞错或通用 Map 掩盖明确契约。
- 不写入真实账号、密码、密钥、令牌、Cookie、生产凭据或个人数据；配置只引用环境变量或安全配置源。
- 日志和错误响应不得包含凭据、密文、完整 URL、广告代码或用户隐私。

## 质量、测试与外部操作

- 修改代码或配置前按 `document/development/code-style.md` 加载当前任务所需的后端、前端或数据库规范。
- 结束前执行与变更范围相符的格式检查、静态检查、生产构建或配置解析，并运行 `git diff --check`。
- 默认禁止运行任何测试用例。只有用户在当前任务明确授权后，才能运行 Maven test、Vitest 或其他测试脚本；未授权的 Maven 构建必须使用 `"-Dmaven.test.skip=true"`。
- 安装或升级依赖、访问网络、启动服务、执行数据库脚本、写入工作区外目录、发布、推送、归档和关机需要用户明确授权，除非已明确属于当前请求。
- 不使用 `git reset --hard`、`git clean`、强制推送或递归删除处理普通开发问题。

## Code Review

- 优先检查权限绕过、项目数据串读、敏感信息泄露、公开接口缓存错误、SSR 崩溃、迁移不可回滚和破坏性兼容问题。
- 发现问题时给出具体文件、触发条件、影响和最小安全修复，并核对实现是否满足当前 OpenSpec scenario。
- 不要求通过修改 `platform/`、关闭校验或放宽安全边界来消除业务模块错误。

## 完成定义

- 代码、SQL、API 类型、文档和 OpenSpec 任务相互一致。
- 没有真实凭据、无关重排、未说明依赖或未授权测试。
- 适用的非测试检查和生产构建已执行，失败项与既有基线已准确说明。
- OpenSpec 严格校验通过；是否提交、推送或归档由用户单独决定。
