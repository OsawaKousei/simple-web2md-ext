variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "tags" {
  description = "Tags applied to resources"
  type        = map(string)
  default     = {}
}

variable "bucket_name" {
  description = "S3 bucket name for static website hosting"
  type        = string
  default     = "kupacllc-homepage-static-website"
}

variable "cloudfront_distribution_name" {
  description = "CloudFront distribution name"
  type        = string
  default     = "kupacllc-homepage-cloudfront"
}

variable "aws_profile" {
  description = "AWS shared config profile name used by Terraform AWS provider"
  type        = string
  default     = "kupacllc"
}

variable "public_domain" {
  description = "Public domain name for CloudFront alias (for example: www.example.com)"
  type        = string
  default     = "www.kupac.co.jp"
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for the public domain (must be in us-east-1 for CloudFront)"
  type        = string
  default     = "arn:aws:acm:us-east-1:103492189525:certificate/77cd69cf-f552-4483-bce1-f0d1bc0b9869"
}