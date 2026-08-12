# 后端规则

本文件适用于 `service/`，并继承仓库根 `AGENTS.md`。

## 模块职责

- `admin`：Spring Boot 启动、配置绑定、Controller、Web 安全、统一异常响应，以及公开 API 的编排 Service。
- `business`：领域对象、DTO、Service、业务权限、MyBatis Mapper 和缓存失效。
- `integration`：第三方平台等外部系统边界。
- 依赖只能沿 `admin -> business -> integration`；integration 不得引用 business，business 不得引用 admin。

## Java 风格

- 新增代码先按接口类型选择 `document/development/backend-code-style.md` 的模板：管理端 CRUD 使用管理端 CRUD 模板，公开 API 使用公开 API 模板；模板规则优先于本节的通用约定。
- 管理端 CRUD 使用 4 空格、Allman 大括号、`@Autowired` 字段注入和 `I...Service` 约定；公开 API 使用 2 空格、K&R 大括号与 `private final` 构造器注入。
- 目标 Java 标准见 `document/development/code-style.md` 与 `document/development/backend-code-style.md`；涉及 SQL 时还须读取 `database-code-style.md`。当前 `spotless:apply` 仍使用 AOSP profile；禁止为迁移模板而全量格式化存量文件。
- 禁止通配符 import、原始类型和无约束反射；能用明确 DTO、record、enum 时不使用动态 Map。
- 业务异常使用项目统一异常类型和简体中文安全提示；日志使用参数占位符，不拼接敏感内容。
- 对外 Service、复杂安全边界和非显然降级策略写简短 Javadoc；不要给显然的 getter/setter 添加噪声注释。

## Web 与权限

- Controller 按选定模板保持薄层：管理端 CRUD 使用 `@PreAuthorize` 校验入口权限、写操作使用 `@Log`；公开 API 使用 `@Anonymous`、`@Validated` 和 Request/Response 契约。存在 Bean Validation 约束时，在对应请求参数上使用 `@Valid`。
- Service 必须再次校验超级管理员或项目角色，不依赖 Controller 和前端隐藏按钮。
- 读取、更新和删除项目资源时，查询条件必须同时包含资源 ID 与项目 ID，禁止“先按 ID 读取、后信任请求项目”的越权窗口。
- 公开 API 只返回安全 Response；不要把 Domain、密文列或内部异常堆栈直接序列化。管理端 CRUD 使用领域对象作为控制器入参与返回数据。
- 可选能力故障应记录无敏感信息的告警并安全降级；核心写入失败不得伪装成功。

## MyBatis 与 SQL

- Mapper 接口位于业务领域包，XML 位于 `service/business/src/main/resources/mapper/<domain>/`。
- 列表查询使用明确列清单；大字段、密文和脚本仅允许在确需的受控查询中读取。
- 动态条件使用参数绑定，禁止 `${}` 拼接用户输入。
- 变更后检查 XML 可解析、SQL 无物理外键、索引顺序与主要查询前缀一致。
- 写操作需要事务时在 Service 标注 `@Transactional`，并在成功提交的语义下推进缓存版本。

## 验证

```powershell
mvn.cmd -f service/pom.xml spotless:check
mvn.cmd -f service/pom.xml "-Dmaven.test.skip=true" package
```

除非用户在当前任务明确授权，禁止运行 `mvn test`、Surefire/Failsafe 测试目标或任何测试类。
