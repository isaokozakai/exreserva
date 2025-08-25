# Use Node.js 18 Slim for a glibc-based image and install openssl
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install openssl and other necessary packages
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Generate Prisma client
RUN yarn db:generate

# Build the application
RUN yarn build

# Remove dev dependencies
RUN yarn install --frozen-lockfile --production=true

# Create non-root user
# Using a more standard user creation for Debian-based images
RUN groupadd --system nodejs && useradd --system --gid nodejs nextjs

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["yarn", "start"]

