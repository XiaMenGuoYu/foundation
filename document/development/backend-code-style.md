# 后端代码规范

本文件是 Java、Spring、HTTP API 和后端可观测性规则的按需细则。实现 `service/` 时，先阅读 [code-style.md](code-style.md) 的通用规则，再阅读本文；涉及可执行 SQL 时同时阅读 [database-code-style.md](database-code-style.md)。

## 1. 权威基线

- 后端代码按接口类型选择本文件第 7 节的正式模板：管理端 CRUD 使用管理端 CRUD 模板，公开 API 使用公开 API 模板。模板规则与通用规则冲突时，以模板规则为准。
- 未被模板覆盖的 Java 格式、源文件结构与命名遵循 [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)，格式真值为 [google-java-format](https://github.com/google/google-java-format) 默认 Google profile。
- Spring Bean 的依赖组织遵循 [Spring Framework Dependency Injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)。
- 安全日志遵循 [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)。

## 2. Java 格式与命名

- 管理端 CRUD 使用 4 空格块缩进和 Allman 大括号；公开 API 使用 2 空格块缩进和 K&R 大括号。每个文件只能采用其中一种模板。
- 每个源文件只包含一个顶级类型，文件名与顶级类型完全一致。文件结构依次为版权声明（如有）、`package`、`import`、顶级类型，各区段之间一个空行。
- 禁止通配符 import；静态 import 与普通 import 分组，组内按 ASCII 排序。即使分支只有一行也必须写花括号。
- 包名只使用小写字母和数字；类、接口、枚举使用 `UpperCamelCase`；方法、字段、参数和局部变量使用 `lowerCamelCase`；常量使用 `UPPER_SNAKE_CASE`。
- 缩写按普通单词处理，如 `projectId`、`HttpClient`、`SeoConfig`。不使用成员前缀、匈牙利命名、下划线后缀或类型缩写。
- 包已表达公开访问、HTTP 或业务场景时，类型名不得重复使用 `Public`、`Api` 等前缀；公开 API 类型按“业务 + 动作 + 角色”命名，例如 `NewsQueryRequest`、`ToolDetailResponse`。
- `@Override` 在合法位置必须使用；禁止原始类型、无约束反射和无边界 `Map` 代替明确模型。

## 3. 模型与分层

- 管理端 CRUD 的持久化实体位于 `service/business/src/main/java/.../domain/`，使用领域语义命名，并可作为 Controller 的入参与返回数据；公开 API 的入参、出参分别使用 `CreateXxxRequest`、`UpdateXxxRequest`、`XxxQuery` 与 `XxxResponse`、`XxxSummary`、`XxxDetail`，且不得直接暴露持久化实体。
- Controller 只负责协议适配、入口鉴权、输入校验、调用应用服务和响应映射；不得编写事务性业务流程。
- Service 负责用例编排、事务边界和领域规则；Mapper/Repository 只负责持久化访问。依赖方向必须从接口适配层指向应用/领域层，再指向基础设施抽象。
- 面向外部调用方的服务编排必须位于 `service/admin`，并直接复用 `service/business` 的既有领域 Service；不得在 business 中新增仅服务于外部调用方的编排、转发或投影 Service。
- 管理端 CRUD 的 Controller 与 Service 使用 `@Autowired` 字段注入；公开 API 的 Controller 与编排 Service 使用 `private final` 构造器注入。Spring 单例 Bean 不得保存请求级可变状态；循环依赖是设计缺陷。
- 事务标注在 Service 的公开用例边界；只读查询应使用只读事务语义（框架支持时）。

## 4. API、校验与类型

- 外部输入必须在边界校验：Bean Validation 表达结构约束，Service 表达需要查询或跨聚合判断的业务约束。公开 API 在类上使用 `@Validated`；存在 Bean Validation 约束时，在请求参数上使用 `@Valid`。
- API JSON 字段使用 `lowerCamelCase`；URL 路径使用小写 kebab-case，集合资源使用复数名。
- 公开 API 的 Controller 不得暴露数据库实体、SQL、内部类名或堆栈，直接返回 Response 类型；管理端 CRUD 使用 `AjaxResult`、`TableDataInfo` 与领域对象。错误必须映射为稳定的业务错误码与安全消息。
- 分页、排序和筛选必须有上限、默认值和白名单；不得把客户端排序字段直接拼接到 SQL。
- 幂等性、权限和数据范围属于服务端规则，不能依赖前端隐藏按钮保证。项目资源查询、更新和删除必须同时约束资源 ID 与项目上下文。
- 时间使用 `java.time`；金额和精确小数使用 `BigDecimal` 并明确舍入规则；`BigDecimal` 数值比较使用 `compareTo`。
- 对外暴露的集合不得泄露内部可变集合；不返回 `null` 集合。单值是否允许 `null` 必须由边界契约明确。
- `Optional` 只用于“可能没有一个返回值”的返回类型，不用于实体字段、请求字段或方法参数。

## 5. Lombok、异常与日志

- Lombok 只消除无业务语义的样板代码。可以使用明确的 getter、构造器注解和经评审的 builder。
- 持久化实体禁止 `@Data`；包含延迟加载关系、敏感字段或大对象的类型必须显式控制 `toString`、`equals` 和 `hashCode`。
- 捕获异常后不得静默忽略；重新抛出时保留原始 cause，除非有明确的安全脱敏原因。禁止 `catch (Exception)` 后返回成功或仅打印堆栈。
- 使用 SLF4J 参数化日志，禁止字符串拼接。日志记录足够的“何时、何处、谁、做什么”上下文，但只记录排障所需的最小数据。
- 禁止记录密码、验证码、token、session ID、Cookie、Authorization 头、连接串、密钥和完整个人敏感信息。来自外部的日志字段必须防范 CR/LF 等日志注入。
- `ERROR` 表示需要处理的失败，`WARN` 表示异常但可恢复状态，`INFO` 表示重要业务状态变化，`DEBUG` 用于开发排障。同一异常只由能补充上下文或最终处理的层记录。

## 6. 当前格式化约束

`service/pom.xml` 当前的 Spotless 使用 google-java-format `AOSP` profile。管理端 CRUD 的格式与该执行器一致；公开 API 保持公开 API 模板的 2 空格和 K&R 结构。普通业务变更不得为统一模板而全量格式化存量 Java。

## 7. 正式开发模板

### 7.1 管理端 CRUD

管理端业务列表、详情、新增、修改、删除和导出使用以下模板；规则独立于任何具体业务功能或示例文件。

- Controller 位于 `service/admin/src/main/java/.../controller/business/`；领域对象、Mapper、`I...Service` 接口和实现类分别位于 `service/business` 的 `domain/`、`mapper/`、`service/` 和 `service/impl/`，Mapper XML 位于 `src/main/resources/mapper/business/`。
- 使用 4 空格、Allman 大括号和 `@Autowired` 字段注入；管理端 Controller 继承 `BaseController`，列表使用 `TableDataInfo`，写操作与详情使用 `AjaxResult`。
- 权限使用 `@PreAuthorize`，新增、修改、删除和导出使用 `@Log`；导出使用 `ExcelUtil`。领域对象可配合 `@Excel`、`@JsonFormat` 直接参与管理端请求、列表和详情响应。

### 7.2 公开 API

公开 API 使用以下模板；规则独立于任何具体业务功能或示例文件。

- Controller 位于 `service/admin/src/main/java/.../controller/api/`，每个 API 专用入参与出参分别位于相邻的 `request/` 与 `response/` 包；公开 API 的编排 `@Service` 允许位于 `service/admin/src/main/java/.../service/`。
- 使用 2 空格、K&R 大括号和 `private final` 构造器注入；Controller 使用 `@Anonymous`、`@Validated`、`@RestController` 与 `@RequestMapping`，方法使用 `@RequestBody` 接收 Request 并直接返回 Response。
- 公开 API 的 Request、Response 使用独立类型，可使用 `@Data` 消除样板代码；不得以持久化实体作为公开 API 的入参或出参。
- Controller 端点方法必须注释其用途、关键请求约束和稳定错误语义；Request/Response 的字段或 record 组件在业务含义、单位、枚举范围或可空性不显然时必须注释；仅在项目隔离、状态过滤、脱敏投影和可选区域降级等核心逻辑处补充解释性注释。
