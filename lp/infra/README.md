# AWS Lambda + API Gateway Terraform構成

このレポジトリは、Terraformを使用してAWS Lambda関数とHTTP API Gatewayを構築するためのインフラストラクチャ構成です。

## 概要

以下のAWSリソースが作成されます：
- AWS Lambda関数（Node.js 22.x）
- HTTP API Gateway
- IAMロール及びポリシー
- Lambda関数とAPI Gatewayの統合

## 前提条件

- AWS CLI がインストールされていること
- Terraform がインストールされていること（v1.0以上推奨）
- AWS SSOまたはIAMユーザーでの認証が設定済みであること

## セットアップ手順

### 1. レポジトリのクローン

```bash
git clone <repository-url>
cd tf-aws-api-endpoint
```

### 2. AWS認証の設定

AWS SSOを使用する場合：
```bash
export AWS_PROFILE="your-sso-profile-name"
```

### 3. Terraformの初期化

```bash
terraform init
```

### 4. 設定の確認

作成されるリソースを確認します：
```bash
terraform plan
```

### 5. リソースのデプロイ

```bash
terraform apply
```

確認プロンプトで `yes` を入力してデプロイを実行します。

### 6. API エンドポイントの確認

デプロイ完了後、出力されるAPI Gateway URLを使用してテストできます：
```bash
curl <api-gateway-url>
```

## カスタマイズ

### リソース名の変更

`main.tf`の変数を編集してリソース名をカスタマイズできます：

```hcl
variable "lambda_function_name" {
  default = "your-lambda-function-name"
}

variable "api_gateway_name" {
  default = "your-api-gateway-name"
}
```

または、コマンドライン引数で指定：
```bash
terraform apply -var="lambda_function_name=my-custom-lambda"
```

### Lambda関数コードの変更

`main.tf`の`data "archive_file" "lambda_zip"`セクションでLambda関数のコードを変更できます。

## クリーンアップ

作成したリソースを削除するには：
```bash
terraform destroy
```

## トラブルシューティング

### よくある問題

1. **権限エラー**
   - AWS認証情報が正しく設定されているか確認
   - IAMユーザー/ロールに必要な権限があるか確認

2. **リソース名の競合**
   - Lambda関数名やAPI Gateway名が既存のものと重複していないか確認
   - 変数を使用して異なる名前を指定

3. **リージョンの問題**
   - `main.tf`でリージョンが正しく設定されているか確認（デフォルト: ap-northeast-1）

## 出力

デプロイ後、以下の情報が出力されます：
- `api_gateway_url`: API GatewayのエンドポイントURL
