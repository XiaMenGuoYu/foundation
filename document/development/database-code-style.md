# 数据库与 SQL 规范

本文件是 MySQL、表结构、Mapper SQL、迁移脚本和管理端菜单初始化 SQL 的技术细则。涉及 `service/sql/`、Mapper SQL 或数据模型时，先阅读 [code-style.md](code-style.md) 的通用规则，再完整阅读本文。

## 1. 权威基线

MySQL 语法和标识符边界遵循 [MySQL 8.4 Language Structure](https://dev.mysql.com/doc/refman/8.4/en/language-structure.html)。表、列、索引与约束名称不得超过 MySQL 的 64 字符限制。

## 2. 命名与格式

- 数据库、表、列、索引和约束只使用小写 ASCII `snake_case`，避免大小写文件系统差异。
- 业务表统一使用 `bsn_` 前缀；RuoYi 平台自带的 `sys_` 表保持原前缀，不得与业务表混用。
- 新建业务表使用简短、明确的单数实体名，格式为 `bsn_<entity>`。日期、统计粒度、所属模块等已由字段或上下文表达的信息不得重复拼入表名；只有短名称确实会产生歧义时才使用复合实体名。
- 主键统一使用 `id`，关联列使用 `<referenced_entity>_id`。布尔列使用正向谓词，例如 `enabled`、`visible`；时间点列使用 `<event>_time`，日期列使用 `<event>_date`。
- 普通索引使用 `idx_<table>_<columns>`，唯一索引使用 `uk_<table>_<columns>`。不得依赖反引号使用保留字或特殊字符。
- SQL 关键字大写，标识符小写。每个 DDL/DML 语句以分号结束；多列、选择列、更新列和条件按逻辑逐行排列，使用 2 空格缩进。
- 生产查询必须显式列出所需列，禁止 `SELECT *`；JOIN 必须写明类型和条件，禁止逗号连接。复杂条件用括号明确优先级。

## 3. 业务表结构

- 新建业务表按“主键、业务字段、通用字段、约束与索引”的顺序定义。主键统一为 `id BIGINT NOT NULL AUTO_INCREMENT`，并显式声明 `PRIMARY KEY (id)`。
- 每张业务表完整保留以下通用字段。仅当数据模型设计说明例外理由并取得用户明确确认后，才允许省略：

```sql
create_by VARCHAR(64) NOT NULL DEFAULT '' COMMENT '创建人账号',
create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
update_by VARCHAR(64) NOT NULL DEFAULT '' COMMENT '更新人账号',
update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
remark VARCHAR(500) NULL DEFAULT NULL COMMENT '备注'
```

- 业务表统一使用 `ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci`；表和业务字段必须提供准确的中文注释。
- 业务表不建立物理外键，由 Service 保证关联完整性；必须根据实际访问路径提供必要的唯一约束和查询索引。
- 数据模型设计必须列出查询过滤、关联和排序依据，只为这些已知访问路径设计索引，不创建猜测性索引。
- 大字段、密文和敏感配置不得进入普通列表投影或普通详情响应。

## 4. 查询安全与性能

- SQL 参数必须绑定，禁止拼接外部输入。动态字段名、排序方向和 SQL 片段必须来自服务端白名单。
- 项目级查询、修改和删除必须同时约束资源标识与项目上下文，不能先按资源标识读取后仅在 Java 中判断归属。
- 列表查询不读取大字段、密文或敏感配置；确需读取时只能在受控的详情或内部操作中显式投影。
- 索引设计必须服务于实际查询的过滤、关联和排序前缀；不要为单次查询或猜测性需求创建索引。
- 写操作需要事务时，由 Service 定义事务边界；Mapper 不承担业务一致性决策。

## 5. 迁移与回滚

- 可执行迁移脚本放在 `service/sql/`，文件名采用 `VNNN__<capability>.sql`；已有基线脚本保留原名，后续迁移版本必须单调递增。
- 已在共享环境执行的迁移不得原地改写；修复通过新迁移完成。
- 每次迁移必须可重复审查：说明前置条件、锁表风险、数据回填、校验方法和回滚策略。
- 新增 `NOT NULL` 列必须处理历史数据与默认值；大表索引、列类型修改和回填必须评估锁、执行时间与磁盘占用。
- 人工回滚说明放在 `service/sql/rollback/`，并与迁移脚本对应。回滚按依赖关系逆序执行，明确不可逆数据及恢复前提。
- 不自动执行迁移、回滚、清库或数据修复脚本。

## 6. 管理端菜单权限初始化

菜单权限 SQL 属于数据库技术模板，业务变更只替换资源名、菜单名、路由、组件和权限占位符，不把某个具体业务菜单固化在规范中。

### 6.1 通用要求

- `sys_menu` 的列必须显式列出，不依赖表的物理列顺序。
- 不硬编码新菜单的 `menu_id`；通过稳定的父菜单条件定位 `parent_id`，通过唯一的 `perms` 判断是否已存在。
- 页面菜单使用 `M` 或 `C` 类型，按钮使用 `F` 类型；业务按钮分别声明 `query`、`add`、`edit`、`remove`、`export` 权限。
- 新菜单默认不自动授予普通角色；角色授权由管理员在权限配置中完成。若产品要求初始化授权，必须另行说明目标角色和幂等策略。
- 回滚先删除按钮，再删除页面菜单；均使用稳定权限字符串定位，不使用部署环境中的自增 ID。

### 6.2 页面菜单模板

```sql
INSERT INTO sys_menu (
  menu_name,
  parent_id,
  order_num,
  path,
  component,
  query,
  route_name,
  is_frame,
  is_cache,
  menu_type,
  visible,
  status,
  perms,
  icon,
  create_by,
  create_time,
  update_by,
  update_time,
  remark
)
SELECT
  '<菜单名称>',
  parent.menu_id,
  <排序号>,
  '<resource-path>',
  '<domain/resource/index>',
  '',
  '',
  1,
  0,
  'C',
  '0',
  '0',
  'business:<resource>:list',
  '<图标>',
  'admin',
  CURRENT_TIMESTAMP,
  '',
  NULL,
  '<菜单说明>'
FROM sys_menu parent
WHERE parent.perms = 'business:<parent-resource>:list'
  AND NOT EXISTS (
    SELECT 1
    FROM sys_menu existing
    WHERE existing.perms = 'business:<resource>:list'
  )
LIMIT 1;
```

### 6.3 按钮权限模板

以下模板按 `query`、`add`、`edit`、`remove`、`export` 分别执行，并替换动作名称、排序号和权限字符串：

```sql
INSERT INTO sys_menu (
  menu_name,
  parent_id,
  order_num,
  path,
  component,
  query,
  route_name,
  is_frame,
  is_cache,
  menu_type,
  visible,
  status,
  perms,
  icon,
  create_by,
  create_time,
  update_by,
  update_time,
  remark
)
SELECT
  '<动作名称>',
  page.menu_id,
  <排序号>,
  '#',
  '',
  '',
  '',
  1,
  0,
  'F',
  '0',
  '0',
  'business:<resource>:<action>',
  '#',
  'admin',
  CURRENT_TIMESTAMP,
  '',
  NULL,
  ''
FROM sys_menu page
WHERE page.perms = 'business:<resource>:list'
  AND NOT EXISTS (
    SELECT 1
    FROM sys_menu existing
    WHERE existing.perms = 'business:<resource>:<action>'
  )
LIMIT 1;
```

### 6.4 回滚模板

```sql
DELETE FROM sys_menu
WHERE perms IN (
  'business:<resource>:query',
  'business:<resource>:add',
  'business:<resource>:edit',
  'business:<resource>:remove',
  'business:<resource>:export'
);

DELETE FROM sys_menu
WHERE perms = 'business:<resource>:list';
```
