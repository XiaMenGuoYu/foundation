# 后端业务协作规则

本文件适用于 `service/`，并继承仓库根 `AGENTS.md`。Java、Spring、API、日志和 SQL 的技术写法以 `document/development/` 对应规范为准；本文件只描述后端业务边界和仓库内复用要求。

## 模块职责

- `admin` 承载启动配置、Controller、Web 安全、统一异常响应，以及面向 customer-ui 等外部调用方的编排 Service。
- `business` 承载领域对象、领域 DTO、Service、业务权限、Mapper 和缓存失效；不得新增仅为外部调用方做转发或投影的重复编排 Service。
- `integration` 承载第三方平台适配器，不反向依赖业务模块。
- 依赖方向固定为 `admin -> business -> integration`；business 不得依赖 admin，integration 不得依赖 business。

## 项目隔离与业务权限

- Controller 只做协议适配和入口鉴权；Service 必须再次校验超级管理员或项目角色，不依赖前端隐藏按钮。
- 所有项目级查询和写入必须显式携带并校验 `projectId` 或服务端解析的项目上下文，不得信任前端传入的归属关系。
- 读取、修改和删除项目资源时，查询条件必须同时包含资源主键与项目上下文，禁止先按主键读取后再补做归属判断。
- 管理端列表、详情和写操作使用领域 Service；公开 API 的项目解析、状态过滤、排序、分页、安全投影和响应组装位于 admin 编排 Service，并直接复用领域 Service。
- 公开 API 只返回安全 Response，不暴露 Domain、密文、大字段或内部异常；可选增强故障可以安全降级，核心写入失败不得伪装成功。

## 通用后端能力复用

- 周期、延迟或可配置调度统一复用 RuoYi 系统定时任务，调用目标使用 `<beanName>.<methodName>`；Cron、启停、并发和错过执行策略由系统任务配置管理。
- 业务模块不得使用 `@Scheduled`、`@EnableScheduling` 或硬编码调度表达式另建调度链路。任务 Bean 只调用已有领域 Service，不复制领域规则。
- 需要随版本初始化任务时，通过版本化 SQL 注册调用目标并提供人工回滚说明；不得在应用启动代码中重复创建任务。

## 管理端菜单与权限

- 新增独立管理入口时必须同步 Controller 权限、admin-ui 权限、`sys_menu` 菜单和按钮初始化及人工回滚。
- 权限命名、`@PreAuthorize` 契约和管理端 CRUD 模板以 `document/development/backend-code-style.md` 为准。
- `sys_menu` 的幂等初始化和回滚 SQL 模板以 `document/development/database-code-style.md` 为准；不得修改 `platform/sql/` 或自动扩大普通角色权限。

## 规范入口

- 任意后端代码先阅读 `document/development/code-style.md` 和 `document/development/backend-code-style.md`。
- 涉及表结构、迁移或 Mapper SQL 时，同时阅读 `document/development/database-code-style.md`。
- 管理端 CRUD 与公开 API 必须分别使用后端规范中的正式模板，不得以存量代码偏差反向降低标准。

## 验证

```powershell
mvn.cmd -f service/pom.xml spotless:check
mvn.cmd -f service/pom.xml "-Dmaven.test.skip=true" package
```

Spotless 不可用时必须说明原因并执行可用的编译或生产打包门禁。未经用户在当前任务明确授权，不得运行 Maven test、Surefire/Failsafe 测试目标或任何测试类。
