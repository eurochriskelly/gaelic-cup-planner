#!/usr/bin/env bash
set -euo pipefail

# Always run from repo root
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

# Load env
set -a
source .env
[ -f .kamal/secrets.tst ] && source .kamal/secrets.tst
[ -f .env.local ] && source .env.local
set +a

# Check for explicit PORT override first
if [ -n "${PORT:-}" ]; then
	PORT_VAR="PORT (explicit)"
else
	# Get app name from environment
	APP="${PP_DEV_APP:-}"

	if [ -z "$APP" ]; then
		echo "Error: PP_DEV_APP is not set"
		echo "Usage: PP_DEV_APP=appname make dev"
		exit 1
	fi

	# Build the variable name and get the port
	PORT_VAR="PP_PORT_${APP}"
	PORT="${!PORT_VAR:-}"

	if [ -z "$PORT" ]; then
		echo "Error: ${PORT_VAR} is not set or empty"
		exit 1
	fi
fi

if [ "${DRYRUN:-}" = "true" ]; then
	echo "[DRYRUN] Would start dev server on port $PORT using $PORT_VAR"
	echo "[DRYRUN] Command: pnpm dev --port $PORT"
	exit 0
fi

set -a
[ -f .env.local ] && source .env.local
set +a

echo "Starting dev server on port $PORT..."
pnpm dev --port "$PORT"
