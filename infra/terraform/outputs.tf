output "vercel_frontend_url" {
  value = vercel_project.frontend.live_url
}

output "render_backend_url" {
  value = render_service.backend.url
}

output "neon_database_connection_string" {
  value     = neon_project.exreserva_db.connection_string
  sensitive = true
}

output "r2_bucket_endpoint" {
  value = cloudflare_r2_bucket.exreserva_r2.public_path
}
