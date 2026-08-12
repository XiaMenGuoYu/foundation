---
name: tencent-cloud-deploy
description: 使用仓库固定的 Docker Compose 流程，将资源导航系统部署到已配置的腾讯云 CVM。适用于验证、发布、检查或回滚 `.codex/deploy/*.yaml` 中定义的目标环境，并覆盖独立的管理端与用户端前端。
---

# 腾讯云部署

使用 `scripts/deploy.py` 和 `scripts/rollback.py`；不得临时拼接远程命令或执行清单中提供的命令。默认实际目标清单为 `.codex/deploy/tencent-prod.yaml`，必须从 `assets/tencent-prod.yaml.example` 复制并填充。示例文件仅提供字段结构，脚本不会将其用作真实环境配置。

## 首次使用

1. 创建本机密码文件；内容仅为 SSH 密码，且不得提交到 Git。
2. 从 `assets/tencent-prod.yaml.example` 创建目标清单，填写服务器、远程 Compose 位置、后端及两个前端的服务名和健康检查地址。
3. 在技能私有虚拟环境安装 `scripts/requirements.txt` 中的依赖；安装网络依赖前须获得用户授权。
4. 先执行 `python scripts/deploy.py --dry-run`；如需部署另一目标，再显式使用 `--config .codex/deploy/<target>.yaml`。

## 固定发布流程

使用 `python scripts/deploy.py`。脚本读取默认真实清单，按固定顺序构建 Java 后端、管理端、用户端，上传到远程发布目录，调用指定 Compose 文件启动固定服务，检查后端和两个前端 URL；失败时运行固定回滚流程。

## 固定回滚流程

使用 `python scripts/rollback.py --config <config>`。脚本恢复远程 `previous` 发布快照，并重新执行固定 Compose 服务启动。只在已确认需要回滚时运行。

## 安全规则

- 密码仅可由 `server.password_file` 指向的本地未跟踪文件读取；不得在对话、日志、命令行或 Compose 文件中提供密码。
- 若 `server.host_key_sha256` 与服务器身份不符，立即停止。
- 清单不支持任意 shell 命令；脚本仅运行仓库定义的构建与发布步骤。
