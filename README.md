# Exreserva - Tour Booking Application

A full-stack tour booking application built with modern technologies, featuring user authentication, tour management, and reservation booking capabilities.

## 🚀 Features

- **User Authentication**: Signup, login, and JWT-based authentication
- **Tour Management**: Create, view, edit, and delete tours
- **Reservation System**: Book tours with date and guest count
- **Access Control**: Public tour viewing, protected tour creation and booking
- **Responsive Design**: Modern UI built with TailwindCSS
- **Real-time Data**: TanStack Query for efficient data fetching
- **Mock Data**: Built-in sample data for development and testing

## 🏗️ Architecture

### Backend

- **Node.js** with **Express** framework
- **TypeScript** for type safety
- **Prisma** ORM with **PostgreSQL** database
- **JWT** authentication with bcrypt password hashing
- **RESTful API** with proper error handling and validation

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **TanStack Query** for server state management
- **React Hook Form** for form handling
- **Axios** for API communication

### Infrastructure

- **Docker** containers for easy deployment
- **Terraform** for AWS infrastructure provisioning
- **Kubernetes** manifests for container orchestration
- **PostgreSQL** database (RDS on AWS)

## 📁 Project Structure

```
exreserva/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Server entry point
│   ├── prisma/             # Database schema
│   ├── Dockerfile          # Backend container
│   └── package.json
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utilities and API
│   │   └── types/          # TypeScript types
│   ├── Dockerfile          # Frontend container
│   └── package.json
├── mock/                    # Mock data and services
│   ├── tours.ts            # Sample tour data
│   ├── users.ts            # Sample user data
│   ├── reservations.ts     # Sample reservation data
│   └── auth.ts             # Mock auth service
├── infra/                   # Infrastructure as Code
│   ├── terraform/          # AWS infrastructure
│   └── k8s/                # Kubernetes manifests
├── docker-compose.yml       # Local development setup
└── README.md
```

## 🛠️ Tech Stack

### Backend

- Node.js 18+
- Express 4.18+
- TypeScript 5.2+
- Prisma 5.7+
- PostgreSQL 15+
- JWT + bcrypt
- CORS

### Frontend

- Next.js 14+
- React 18+
- TypeScript 5+
- TailwindCSS 3.3+
- TanStack Query 5.8+
- Axios 1.6+
- React Hook Form 7.48+

### Infrastructure

- Docker & Docker Compose
- Terraform 1.0+
- Kubernetes (k3d)
- AWS (EC2, RDS, ECS, ALB, S3)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd exreserva
   ```

2. **Start with Docker Compose (Recommended)**

   ```bash
   docker-compose up -d
   ```

   This will start:

   - PostgreSQL database on port 5432
   - Backend API on port 3001
   - Frontend app on port 3000
   - Prisma Studio on port 5555

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Prisma Studio: http://localhost:5555

### Manual Setup

1. **Backend Setup**

   ```bash
   cd backend
   yarn install
   cp env.example .env
   # Edit .env with your database credentials
   yarn db:generate
   yarn db:push
   yarn dev
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   yarn install
   yarn dev
   ```

3. **Database Setup**

   ```bash
   # Create PostgreSQL database
   createdb exreserva

   # Run Prisma migrations
   cd backend
   yarn db:migrate
   ```

## 🔐 Authentication

### Demo Accounts

For testing purposes, the following accounts are available:

- **Jean Dupont** (Tour Creator)

  - Email: `jean@paristours.com`
  - Password: `password123`

- **Yuki Tanaka** (Tour Creator)
  - Email: `yuki@japantours.com`
  - Password: `password123`

### API Endpoints

#### Public Routes

- `GET /api/tours` - List all tours
- `GET /api/tours/:id` - Get tour details
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication

#### Protected Routes

- `POST /api/tours` - Create new tour (authenticated users)
- `PUT /api/tours/:id` - Update tour (tour creator only)
- `DELETE /api/tours/:id` - Delete tour (tour creator only)
- `POST /api/reservations` - Book a tour (authenticated users)
- `GET /api/reservations` - User's reservations (authenticated users)

## 🗺️ API Documentation

### Tour Object

```typescript
{
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl?: string;
  duration: number;
  maxCapacity: number;
  creatorId: string;
  creator: User;
  createdAt: string;
  updatedAt: string;
}
```

### Reservation Object

```typescript
{
  id: string;
  tourId: string;
  userId: string;
  date: string;
  guests: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  tour: Tour;
  user: User;
  createdAt: string;
  updatedAt: string;
}
```

## 🚀 Deployment

### AWS Deployment with Terraform

1. **Configure AWS credentials**

   ```bash
   aws configure
   ```

2. **Initialize Terraform**

   ```bash
   cd infra/terraform
   terraform init
   ```

3. **Create terraform.tfvars**

   ```hcl
   aws_region = "us-east-1"
   db_password = "your-secure-password"
   certificate_arn = "arn:aws:acm:region:account:certificate/cert-id"
   ```

4. **Deploy infrastructure**
   ```bash
   terraform plan
   terraform apply
   ```

### Kubernetes Deployment

1. **Start k3d cluster**

   ```bash
   k3d cluster create exreserva
   ```

2. **Build and load Docker images**

   ```bash
   docker build -t exreserva-backend:latest ./backend
   docker build -t exreserva-frontend:latest ./frontend
   k3d image import exreserva-backend:latest -c exreserva
   k3d image import exreserva-frontend:latest -c exreserva
   ```

3. **Deploy to Kubernetes**

   ```bash
   kubectl apply -f infra/k8s/
   ```

4. **Access the application**
   ```bash
   kubectl port-forward -n exreserva svc/exreserva-frontend-service 3000:3000
   ```

## 🧪 Testing

### Backend Testing

```bash
cd backend
yarn test
```

### Frontend Testing

```bash
cd frontend
yarn test
```

### E2E Testing

```bash
# Start the application
docker-compose up -d

# Run E2E tests
yarn test:e2e
```

## 📊 Monitoring & Health Checks

- **Backend Health**: `GET /health`
- **Database Connection**: Prisma connection status
- **Application Metrics**: Built-in health checks

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Rate limiting (can be added)
- HTTPS enforcement (in production)

## 🚧 Future Enhancements

- [ ] Email notifications
- [ ] Payment integration (Stripe)
- [ ] Image upload and management
- [ ] Advanced search and filtering
- [ ] User reviews and ratings
- [ ] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] Real-time chat support
- [ ] Multi-language support
- [ ] Analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by travel and tourism industry needs
- Community-driven development approach

---

**Happy Tour Booking! 🌍✈️**
