terraform {
  backend "s3" {
    bucket = "terraform-state-bucket-710045722613-ap-northeast-1-an"
    key    = "webpage-infra/xpac-homepage/terraform.tfstate"
    region = "ap-northeast-1"

    profile = "xpac"
  }
}