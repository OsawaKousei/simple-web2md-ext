variable "bucket_name" {
  description = "S3 bucket name for static website hosting"
  type        = string
  default     = "xpac-homepage-static-website"
}

variable "cloudfront_distribution_name" {
  description = "CloudFront distribution name"
  type        = string
  default     = "xpac-homepage-cloudfront"
}

variable "aws_profile" {
  description = "AWS shared config profile name used by Terraform AWS provider"
  type        = string
  default     = "xpac"
}

variable "public_domain" {
  description = "Public domain name for CloudFront alias (for example: www.example.com)"
  type        = string
  default     = "www.xpac.or.jp"
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for the public domain (must be in us-east-1 for CloudFront)"
  type        = string
  default     = "arn:aws:acm:us-east-1:710045722613:certificate/0f976257-3d3a-4678-b917-b9cbea9d031c"
}
