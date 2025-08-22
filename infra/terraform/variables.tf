variable "vercel_token" {
  description = "Vercel API Token"
  type        = string
  sensitive   = true
}

variable "render_api_key" {
  description = "Render API Key"
  type        = string
  sensitive   = true
}

variable "neon_api_key" {
  description = "Neon API Key"
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token for R2"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "database_url" {
  description = "Neon Database Connection URL"
  type        = string
  sensitive   = true
}
