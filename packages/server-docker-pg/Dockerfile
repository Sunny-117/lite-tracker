FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install all dependencies (including dev)
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["pnpm", "run", "start:prod"]
