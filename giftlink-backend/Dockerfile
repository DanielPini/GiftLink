# Use a specific Node.js version for better security and stability
FROM node:20-slim

# Update packages and install required dependencies
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Add non-root user for security
RUN groupadd -r nodeapp && useradd -r -g nodeapp nodeapp

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production && \
    npm cache clean --force && \
    # Remove npm after installation for security
    apt-get remove -y npm && \
    apt-get autoremove -y && \
    apt-get clean

# Copy application code
COPY --chown=nodeapp:nodeapp . .

# Set user
USER nodeapp

# Expose port
EXPOSE 3060

# Health check using curl instead of wget
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3060/health || exit 1

# Set Node.js to run in production mode
ENV NODE_ENV=production

# Start the application
CMD ["node", "app.js"]