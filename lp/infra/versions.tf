terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0"
    }
  }

  backend "s3" {
    bucket  = "terraform-state-bucket-103492189525-ap-northeast-1-an"
    key     = "webpage/kupacllc-homepage/terraform.tfstate"
    region  = "ap-northeast-1"
    profile = "kupacllc"
  }
}