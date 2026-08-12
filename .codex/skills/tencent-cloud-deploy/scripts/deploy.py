#!/usr/bin/env python3
"""Fixed Tencent Cloud deployment workflow for this repository."""
from __future__ import annotations

import argparse
import base64
import hashlib
import shutil
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen


REQUIRED = ("server", "release", "backend", "frontends", "verification")
DEFAULT_CONFIG = Path(".codex/deploy/tencent-prod.yaml")


def load_config(path: Path) -> dict:
    try:
        import yaml
    except ImportError as error:
        raise RuntimeError("缺少依赖；请先安装 scripts/requirements.txt") from error
    if not path.is_file():
        raise RuntimeError(f"部署清单不存在：{path}")
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or any(key not in data for key in REQUIRED):
        raise RuntimeError("部署清单缺少必填区域")
    if set(data["frontends"]) != {"admin", "customer"}:
        raise RuntimeError("frontends 必须同时包含 admin 与 customer")
    password_file = Path(data["server"].get("password_file", ""))
    if not password_file.is_file() or not password_file.read_text(encoding="utf-8").strip():
        raise RuntimeError(f"SSH 密码文件不可读取或为空：{password_file}")
    if not isinstance(data["release"].get("compose_source"), str):
        raise RuntimeError("release.compose_source must reference a local Compose file")
    return data


def run(command: list[str], cwd: Path) -> None:
    subprocess.run(command, cwd=cwd, check=True)


def build(repo: Path, config: dict) -> None:
    run(["mvn.cmd", "-f", "service/pom.xml", "-Dmaven.test.skip=true", "package"], repo)
    run(["npm", "run", "build:prod"], repo / "ui" / "admin-ui")
    run(["npm", "run", "build:prod"], repo / "ui" / "customer-ui")
    if not (repo / config["backend"]["artifact"]).is_file():
        raise RuntimeError("后端构建产物不存在")
    for frontend in config["frontends"].values():
        if not (repo / frontend["dist_dir"]).is_dir():
            raise RuntimeError("前端构建产物不存在")


def connect(config: dict):
    try:
        import paramiko
    except ImportError as error:
        raise RuntimeError("缺少依赖；请先安装 scripts/requirements.txt") from error
    server = config["server"]
    password = Path(server["password_file"]).read_text(encoding="utf-8").strip()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.RejectPolicy())
    client.connect(server["host"], port=server["port"], username=server["user"], password=password,
                   look_for_keys=False, allow_agent=False, timeout=15)
    key = client.get_transport().get_remote_server_key().asbytes()
    fingerprint = "SHA256:" + base64.b64encode(hashlib.sha256(key).digest()).decode().rstrip("=")
    if fingerprint != server["host_key_sha256"]:
        client.close()
        raise RuntimeError("服务器主机指纹不匹配")
    return client


def remote(client, command: str) -> None:
    _, stdout, stderr = client.exec_command(command)
    if stdout.channel.recv_exit_status() != 0:
        raise RuntimeError(stderr.read().decode("utf-8", "replace").strip() or "远程命令执行失败")


def upload_tree(sftp, source: Path, target: str) -> None:
    try:
        sftp.mkdir(target)
    except OSError:
        pass
    for item in source.rglob("*"):
        relative = item.relative_to(source).as_posix()
        destination = f"{target}/{relative}"
        if item.is_dir():
            try:
                sftp.mkdir(destination)
            except OSError:
                pass
        else:
            sftp.put(str(item), destination)


def verify(config: dict) -> None:
    deadline = time.time() + config["verification"]["timeout_seconds"]
    urls = [config["backend"]["health_url"]] + [item["health_url"] for item in config["frontends"].values()]
    pending = set(urls)
    while pending and time.time() < deadline:
        for url in tuple(pending):
            try:
                with urlopen(url, timeout=5) as response:
                    if 200 <= response.status < 400:
                        pending.remove(url)
            except Exception:
                pass
        if pending:
            time.sleep(config["verification"]["retry_interval_seconds"])
    if pending:
        raise RuntimeError("健康检查失败：" + ", ".join(sorted(pending)))


def deploy(repo: Path, config: dict, dry_run: bool) -> None:
    if dry_run:
        print("预检通过：清单结构、密码文件和两个前端配置均有效。")
        return
    build(repo, config)
    compose_source = repo / config["release"]["compose_source"]
    if not compose_source.is_file():
        raise RuntimeError(f"Compose source file does not exist: {compose_source}")
    client = connect(config)
    release = config["release"]
    root = release["remote_root"].rstrip("/")
    staging = f"{root}/staging"
    try:
        remote(client, f"mkdir -p {staging}/backend && rm -rf {staging}/* && mkdir -p {staging}/backend {root}/releases")
        sftp = client.open_sftp()
        sftp.put(str(compose_source), release["compose_file"])
        sftp.put(str(repo / config["backend"]["artifact"]), f"{staging}/backend/admin.jar")
        for name, frontend in config["frontends"].items():
            upload_tree(sftp, repo / frontend["dist_dir"], f"{staging}/{frontend['remote_dir']}")
        sftp.close()
        remote(client, f"[ -d {root}/current ] && rm -rf {root}/previous && mv {root}/current {root}/previous || true; mv {staging} {root}/current")
        services = config["backend"]["container_service"]
        remote(client, f"docker compose -p {release['compose_project']} -f {release['compose_file']} --env-file {release['env_file']} up -d {services}")
        remote(client, "sudo systemctl reload nginx")
        verify(config)
        print("发布成功。")
    except Exception:
        remote(client, f"[ -d {root}/previous ] && rm -rf {root}/current && mv {root}/previous {root}/current || true")
        remote(client, "sudo systemctl reload nginx")
        raise
    finally:
        client.close()


def main() -> int:
    parser = argparse.ArgumentParser(description="固定腾讯云发布脚本")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    try:
        deploy(Path.cwd(), load_config(args.config), args.dry_run)
        return 0
    except Exception as error:
        print(f"发布失败：{error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
