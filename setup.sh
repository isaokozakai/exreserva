#!/bin/bash

echo "🚀 Exreserva Tour Booking App Setup"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/env.example backend/.env
    echo "✅ Backend .env file created"
else
    echo "✅ Backend .env file already exists"
fi

# Create .env.local file for frontend if it doesn't exist
if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend .env.local file..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
    echo "✅ Frontend .env.local file created"
else
    echo "✅ Frontend .env.local file already exists"
fi

echo ""
echo "🔧 Starting the application with Docker Compose..."
echo "This will start:"
echo "  - PostgreSQL database (port 5432)"
echo "  - Backend API (port 3001)"
echo "  - Frontend app (port 3000)"
echo "  - Prisma Studio (port 5555)"
echo ""

# Start the application
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 Application is starting up!"
    echo ""
    echo "📱 Access your application:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:3001"
    echo "  Prisma Studio: http://localhost:5555"
    echo ""
    echo "🔐 Demo accounts:"
    echo "  Email: jean@paristours.com, Password: password123"
    echo "  Email: yuki@japantours.com, Password: password123"
    echo ""
    echo "📚 Check the README.md for more information"
    echo ""
    echo "🛑 To stop the application: docker-compose down"
else
    echo "❌ Some services failed to start. Check the logs with: docker-compose logs"
    exit 1
fi
