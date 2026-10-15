provider "aws" {
  region  = "ap-northeast-1"
  profile = var.aws_profile
}

locals {
  use_custom_domain = var.public_domain != null && var.acm_certificate_arn != null
}

# S3バケットを作成
resource "aws_s3_bucket" "website_bucket" {
  bucket = var.bucket_name

  tags = {
    Name = var.bucket_name
  }
}

# S3バケットのバージョニング設定
resource "aws_s3_bucket_versioning" "website_bucket_versioning" {
  bucket = aws_s3_bucket.website_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3バケットの静的ウェブサイト設定
resource "aws_s3_bucket_website_configuration" "website_bucket_config" {
  bucket = aws_s3_bucket.website_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# S3バケットのパブリックアクセス設定
resource "aws_s3_bucket_public_access_block" "website_bucket_pab" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3バケットポリシー
resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.website_bucket_pab]
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "s3-oac-${var.bucket_name}"
  description                       = "OAC for ${var.bucket_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 拡張子なしURLを /index.html にリライトして 403/404 を防ぐ
resource "aws_cloudfront_function" "url_rewrite" {
  name    = "url-rewrite-${var.bucket_name}"
  runtime = "cloudfront-js-1.0"
  comment = "Rewrite extensionless URLs to index.html"
  publish = true

  code = <<-EOT
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
EOT
}

# CloudFrontディストリビューション
resource "aws_cloudfront_distribution" "website_distribution" {
  aliases = local.use_custom_domain ? [var.public_domain] : []

  origin {
    domain_name              = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.website_bucket.bucket}"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.website_bucket.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = local.use_custom_domain ? var.acm_certificate_arn : null
    ssl_support_method             = local.use_custom_domain ? "sni-only" : null
    minimum_protocol_version       = local.use_custom_domain ? "TLSv1.2_2021" : null
    cloudfront_default_certificate = !local.use_custom_domain
  }

  lifecycle {
    precondition {
      condition     = (var.public_domain == null) == (var.acm_certificate_arn == null)
      error_message = "public_domain と acm_certificate_arn は両方指定するか、両方未指定にしてください。"
    }
  }

  tags = {
    Name = var.cloudfront_distribution_name
  }
}

# CloudFrontからS3バケットへのアクセスを許可するバケットポリシーを更新
resource "aws_s3_bucket_policy" "cloudfront_access_policy" {
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website_distribution.arn
          }
        }
      }
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.website_bucket_pab,
    aws_cloudfront_distribution.website_distribution
  ]
}

# CloudFrontディストリビューションのドメイン名を出力
output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website_distribution.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website_distribution.id
}

# Route53 は手動設定。公開ドメインを使う場合は、この値に対して CNAME/ALIAS を設定する。
output "dns_target_for_manual_route53" {
  description = "DNS target to point your public domain to (configure Route53 manually)"
  value       = aws_cloudfront_distribution.website_distribution.domain_name
}

# S3バケットのウェブサイトエンドポイントを出力
output "s3_website_endpoint" {
  description = "S3 bucket website endpoint"
  value       = aws_s3_bucket_website_configuration.website_bucket_config.website_endpoint
}

output "website_bucket_name" {
  description = "S3 bucket name for website content"
  value       = aws_s3_bucket.website_bucket.id
}