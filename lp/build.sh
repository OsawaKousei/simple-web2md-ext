#!/bin/bash

set -e

echo "🏗️  Starting website build process..."

# 古いビルドを削除
echo "🗑️  Removing old build artifacts..."
rm -rf ./dist

# ビルド用コンテナを作成
echo "🐳 Building Docker container..."
SITE_CANONICAL_URL="${NEXT_PUBLIC_BASE_URL:-https://www.kupac.co.jp}"
docker build \
  --build-arg NEXT_PUBLIC_BASE_URL="$SITE_CANONICAL_URL" \
  -f frontend/Dockerfile \
  -t website-build \
  ./frontend

# 静的ファイルをローカルにコピー
echo "📦 Copying static files to ./dist..."
docker create --name temp-container website-build
docker cp temp-container:/app/out ./dist
docker rm temp-container

echo "✅ Build completed successfully!"
echo "📁 Static files are available in ./dist"
