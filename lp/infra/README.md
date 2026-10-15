# Web to Markdown LP インフラ

Next.js の静的エクスポートを、非公開 S3 バケットと CloudFront OAC で公開します。公開 URL は `https://web2md.prj.kupac.co.jp/` です。Route 53 の hosted zone ID を指定すると A/AAAA alias レコードも作成します。指定しない場合、DNS 設定は別途必要です。

## init 前の準備

1. `backend.hcl.example` を `backend.hcl` にコピーし、state 用 S3 バケット、キー、リージョン、AWS profile を確認する。既存の state バケット名を引き継ぎ、キーは LP 専用にしています。バケットの存在と利用権限は未確認です。
2. `terraform.tfvars.example` を `terraform.tfvars` にコピーする。S3 バケット名が未使用であることを確認し、`acm_certificate_arn` に **us-east-1** の `web2md.prj.kupac.co.jp` を含む証明書 ARN を設定する。Route 53 で DNS も管理する場合は `route53_zone_id` を設定する。
3. AWS 認証を設定する。`backend.hcl` と `terraform.tfvars` は Git 管理対象外です。

この準備ができた後に、以下を実行します（この作業では未実行）。

```bash
cd lp/infra
terraform init -backend-config=backend.hcl
terraform plan
terraform apply
```

サイトのビルドとアップロードは `lp/build.sh`、`lp/deploy.sh` を使用します。`deploy.sh` は state の出力からバケット名と CloudFront ID を読みます。
