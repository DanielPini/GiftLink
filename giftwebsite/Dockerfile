# Use a specific Node.js version for better security and stability
FROM node:20-slim

# Create non-root user for security
RUN groupadd -r nodeapp && useradd -r -g nodeapp nodeapp

# Set working directory
WORKDIR /usr/src/app

# Install curl for healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies and clean up
RUN npm ci --omit=dev && \
    npm cache clean --force && \
    # Remove npm after installation for security
    apt-get clean

# Copy application code
COPY --chown=nodeapp:nodeapp . .

# Set user
USER nodeapp

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:9000/health || exit 1

# Set Node.js to run in production mode
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]