provider "aws" {
  region  = var.aws_region
  profile = "kupacllc"

  default_tags {
    tags = var.tags
  }
}