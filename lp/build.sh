#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_CANONICAL_URL="${NEXT_PUBLIC_BASE_URL:-https://web2md.prj.kupac.co.jp}"
IMAGE_NAME="web2md-lp-build"

rm -rf "$ROOT_DIR/dist"
docker build \
  --build-arg NEXT_PUBLIC_BASE_URL="$SITE_CANONICAL_URL" \
  -f "$ROOT_DIR/frontend/Dockerfile" \
  -t "$IMAGE_NAME" \
  "$ROOT_DIR/frontend"

CONTAINER_ID="$(docker create "$IMAGE_NAME")"
trap 'docker rm -f "$CONTAINER_ID" >/dev/null 2>&1 || true' EXIT
docker cp "$CONTAINER_ID:/app/out" "$ROOT_DIR/dist"
echo "Static files are available in $ROOT_DIR/dist"
