#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$ROOT_DIR/infra"

# Optional: allow selecting AWS profile interactively.
# If left empty, AWS CLI/Terraform use their default credential resolution.
if [[ -t 0 ]]; then
  read -r -p "AWS profile (press Enter for default): " AWS_PROFILE_INPUT
  if [[ -n "${AWS_PROFILE_INPUT//[[:space:]]/}" ]]; then
    export AWS_PROFILE="$AWS_PROFILE_INPUT"
    echo "Using AWS profile: $AWS_PROFILE"
  else
    echo "Using default AWS profile"
  fi
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "Error: aws CLI is not installed."
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "Error: terraform is not installed."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Error: cannot access Docker daemon (permission denied or daemon is not running)."
  echo "Please verify one of the following and retry:"
  echo "  1) Docker daemon is running."
  echo "  2) Your user can access /var/run/docker.sock (docker group)."
  echo "     Example: sudo usermod -aG docker $USER && newgrp docker"
  exit 1
fi

echo "[1/3] Building static site"
bash "$ROOT_DIR/build.sh"

echo "Loading deployment parameters from Terraform state"
DISTRIBUTION_ID="$(terraform -chdir="$INFRA_DIR" output -raw cloudfront_distribution_id)"
BUCKET_NAME="$(terraform -chdir="$INFRA_DIR" output -raw website_bucket_name)"

if [[ -z "$DISTRIBUTION_ID" || -z "$BUCKET_NAME" ]]; then
  echo "Error: failed to read Terraform outputs."
  echo "Run 'terraform -chdir=infra apply' and try again."
  exit 1
fi

echo "[2/3] Syncing dist to s3://$BUCKET_NAME"
aws s3 sync "$ROOT_DIR/dist" "s3://$BUCKET_NAME" --delete

echo "[3/3] Creating CloudFront invalidation"
INVALIDATION_ID="$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)"

echo "Done."
echo "Distribution ID: $DISTRIBUTION_ID"
echo "Invalidation ID: $INVALIDATION_ID"