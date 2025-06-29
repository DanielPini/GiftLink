# Use a specific version of Node.js with alpine for a smaller footprint
FROM node:20-alpine

# Update Alpine packages to fix vulnerabilities
RUN apk update && apk upgrade --no-cache

# Add non-root user for security
RUN addgroup -S nodeapp && \
    adduser -S -G nodeapp nodeapp

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use --production flag to exclude devDependencies
# Use ci instead of install for consistent installations
RUN npm ci --production && \
    # Clean npm cache
    npm cache clean --force

# Copy application code
COPY --chown=nodeapp:nodeapp . .

# Set user
USER nodeapp

# Expose port
EXPOSE 3060

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3060/health || exit 1

# Set Node.js to run in production mode
ENV NODE_ENV=production

# Start the application
CMD ["node", "app.js"]