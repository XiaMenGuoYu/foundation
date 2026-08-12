#!/usr/bin/env python3
"""Fixed rollback entry point for the Tencent Cloud deployment skill."""
import argparse
import sys
from pathlib import Path

from deploy import DEFAULT_CONFIG, connect, load_config, remote


def main() -> int:
    parser = argparse.ArgumentParser(description="固定腾讯云回滚脚本")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    args = parser.parse_args()
    try:
        config = load_config(args.config)
        client = connect(config)
        release = config["release"]
        root = release["remote_root"].rstrip("/")
        services = config["backend"]["container_service"]
        remote(client, f"[ -d {root}/previous ] && rm -rf {root}/current && mv {root}/previous {root}/current")
        remote(client, f"docker compose -p {release['compose_project']} -f {release['compose_file']} --env-file {release['env_file']} up -d {services}")
        remote(client, "sudo systemctl reload nginx")
        client.close()
        print("已回滚到上一个发布版本。")
        return 0
    except Exception as error:
        print(f"回滚失败：{error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
