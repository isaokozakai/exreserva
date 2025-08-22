terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
      version = "0.4.0" # Use a compatible version
    }
    render = {
      source = "render-inc/render"
      version = "0.0.1" # Use a compatible version, or check Render's official provider if available
    }
    neon = {
      source = "neondatabase/neon"
      version = "0.1.1" # Use a compatible version
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "4.0.0" # Use a compatible version
    }
  }
}

# Vercel Provider
provider "vercel" {
  token = var.vercel_token
}

# Render Provider
provider "render" {
  api_key = var.render_api_key
}

# Neon Provider
provider "neon" {
  api_key = var.neon_api_key # Assuming Neon has an API key for Terraform
}

# Cloudflare Provider
provider "cloudflare" {
  api_token = var.cloudflare_api_token # Assuming you'll use an API token for Cloudflare
  # or api_key and email if using global API key
}

# Vercel Project (Frontend)
resource "vercel_project" "frontend" {
  name = "exreserva-frontend"
  framework = "nextjs" # Assuming Next.js based on your folder structure
  git_repository {
    type = "github"
    repo = "exreserva/frontend" # Assuming this is the correct repo name
  }
  # Add environment variables for Vercel if needed
}

# Render Web Service (Backend)
resource "render_service" "backend" {
  name = "exreserva-backend"
  type = "web"
  repo = "https://github.com/your-github-user/exreserva-backend" # Replace with your actual backend repo URL
  branch = "main"
  build_command = "yarn install && yarn build" # Adjust if different
  start_command = "node dist/index.js" # Adjust based on your backend's entry point
  env_vars = {
    DATABASE_URL = var.database_url
    # Add other environment variables for backend
  }
  # Docker specific settings
  docker_context = "./backend" # Path to your backend Dockerfile context
  docker_filePath = "./backend/Dockerfile" # Path to your backend Dockerfile
  # You might need to specify a plan (e.g., "starter", "standard")
  # plan = "starter"
}

# Neon Project (Database)
resource "neon_project" "exreserva_db" {
  name = "exreserva-db"
  # Assuming Neon provider can create a project and give connection string
  # You might need to specify region, etc.
}

# Cloudflare R2 Bucket
resource "cloudflare_r2_bucket" "exreserva_r2" {
  account_id = var.cloudflare_account_id
  name       = "exreserva-r2-bucket" # Using a generic name, you can change this
}

# Outputs
output "vercel_frontend_url" {
  value = vercel_project.frontend.live_url
}

output "render_backend_url" {
  value = render_service.backend.url
}

output "neon_database_connection_string" {
  value     = neon_project.exreserva_db.connection_string # Assuming this output is available
  sensitive = true
}

output "r2_bucket_endpoint" {
  value = cloudflare_r2_bucket.exreserva_r2.public_path
}
