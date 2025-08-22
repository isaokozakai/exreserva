.PHONY: help setup-dev setup-prod down-dev

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  setup-dev    - Set up the development environment"
	@echo "  setup-prod   - Set up the production environment (placeholder)"
	@echo "  down-dev     - Stop the development environment"

setup-dev:
	@echo "🚀 Exreserva Tour Booking App Development Setup"
	@echo "=============================================="
	@if ! command -v docker &> /dev/null; then \
		echo "❌ Docker is not installed. Please install Docker first."; \
		exit 1; \
	fi
	@if ! command -v docker-compose &> /dev/null; then \
		echo "❌ Docker Compose is not installed. Please install Docker Compose first."; \
		exit 1; \
	fi
	@echo "✅ Docker and Docker Compose are available"
	@if [ ! -f "backend/.env" ]; then \
		echo "📝 Creating backend .env file..."; \
		cp backend/env.example backend/.env; \
		echo "✅ Backend .env file created"; \
	else \
		echo "✅ Backend .env file already exists"; \
	fi
	@if [ ! -f "frontend/.env.local" ]; then \
		echo "📝 Creating frontend .env.local file..."; \
		echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > frontend/.env.local; \
		echo "✅ Frontend .env.local file created"; \
	else \
		echo "✅ Frontend .env.local file already exists"; \
	fi
	@echo ""
	@echo "🔧 Starting the application with Docker Compose..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "⏳ Waiting for services to start..."
	@sleep 10
	@if docker-compose -f docker-compose.dev.yml ps --services --filter \"status=running\" | grep -q .; then \
		echo ""; \
		echo "🎉 All services are running!"; \
		echo ""; \
		echo "📱 Access your application:"; \
		echo "  Frontend: http://localhost:3000"; \
		echo "  Backend API: http://localhost:3001"; \
		echo "  Prisma Studio: http://localhost:5555"; \
		echo ""; \
		echo "🔐 Demo accounts:"; \
		echo "  Email: jean@paristours.com, Password: password123"; \
		echo "  Email: yuki@japantours.com, Password: password123"; \
		echo ""; \
		echo "📚 Check the README.md for more information"; \
		echo ""; \
		echo "🛑 To stop the application: make down-dev"; \
	else \
		echo "❌ Some services failed to start. Check the logs with: docker-compose -f docker-compose.dev.yml logs"; \
		exit 1; \
	fi

setup-prod:
	@echo "🚀 Exreserva Tour Booking App Production Setup"
	@echo "============================================="
	@echo "This is a placeholder for the production setup."
	@echo "You should replace this with your actual production setup steps."

down-dev:
	@echo "Stopping development environment..."
	docker-compose -f docker-compose.dev.yml down
