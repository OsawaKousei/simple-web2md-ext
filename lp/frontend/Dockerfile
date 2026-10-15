# Build stage
FROM node:20-alpine AS build

ARG NEXT_PUBLIC_BASE_URL=https://www.kupac.co.jp
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

WORKDIR /app

RUN apk add bash

# package.jsonとpackage-lock.jsonをコピー
COPY ./app/package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY ./app .

# アプリケーションをビルドしてエクスポート
RUN npm run build

# エクスポートされた静的ファイルは /app/out に生成される
CMD ["echo", "Static site exported to /app/out"]
