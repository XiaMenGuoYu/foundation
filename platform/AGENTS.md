#  基础框架规则

## 默认只读

- `platform/` 是 RuoYi 3.9.2 基础框架，不承载系统业务需求。
- 默认不要修改本目录，包括为业务需求增加实体、Controller、Mapper、工具类或配置。
- 不要为了绕过业务模块中的编译、依赖或设计问题而修改框架源码。

## 允许修改的条件

只有以下情况可以修改：

- 用户明确要求升级、修复或定制 RuoYi 框架；或
- 已通过调用链和最小复现证明问题位于框架层，且无法在业务模块安全修复。

修改前说明原因、影响模块、与上游 RuoYi 的差异及回归范围。修改应最小化，并避免夹带业务逻辑。

## 验证

```powershell
mvn.cmd -f platform/pom.xml "-Dmaven.test.skip=true" package
mvn.cmd -f service/pom.xml "-Dmaven.test.skip=true" package
```

除非用户在当前任务明确授权，不得运行框架测试。若框架 API 或行为发生变化，还需构建 `service/` 验证兼容性。
