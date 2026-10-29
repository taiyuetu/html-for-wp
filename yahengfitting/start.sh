#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1
command -v python3 >/dev/null 2>&1 && exec python3 start.py "$@" || exec python start.py "$@"
