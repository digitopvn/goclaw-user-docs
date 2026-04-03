# syntax=docker/dockerfile:1.4

# ===================================
#       BUILD ARGUMENTS
# ===================================
ARG NODE_VERSION=22

# ===================================
#       PHASE 1 - DEPENDENCIES
# ===================================
# FROM node:${NODE_VERSION} AS deps
FROM reg.ult.vn/digitop/goclaw-user-manual-cms:template AS deps

WORKDIR /app

# RUN npm i -g bun

# Copy package files and remove version
COPY package.json ./

# Install dependencies using lock file for consistency
RUN bun install
# RUN bun install @rollup/rollup-linux-x64-gnu bun

# ===================================
#       PHASE 2 - BUILDER
# ===================================
FROM node:${NODE_VERSION} AS builder

# Set build-time variables
ARG NODE_ENV=production

# Set environment variables
ENV NODE_ENV=${NODE_ENV} \
    NODE_OPTIONS=--max_old_space_size=8192

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# RUN rm -rf "src/routes/(example)" "src/routes/(example).tsx"
COPY ./.env.dev ./.env

# Generate build-time env variables - Fixed syntax
RUN VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\([^"]*\)".*/\1/') && \
    echo "\n" >> .env && \
    echo "# Build-time variables" >> .env && \
    echo "NODE_ENV=${NODE_ENV}" >> .env && \
    echo "VITE_VERSION=${VERSION}" >> .env && \
    echo "VITE_BUILD_TIME=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" >> .env

# Update robots.txt Sitemap domain from VITE_BASE_URL
RUN BASE_URL=$(grep -E '^VITE_BASE_URL=' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'") && \
    if [ -n "$BASE_URL" ]; then \
    sed -i "s|Sitemap:.*|Sitemap: ${BASE_URL}|" public/robots.txt; \
    fi

# Build application
RUN npm run build


# # ===================================
# #       PHASE 4 - RUNNER
# # ===================================
# FROM reg.ult.vn/digitop/zit-web:v0-51-2-e6k AS runner

# WORKDIR /usr/app

# # Copy application files with explicit ownership
# COPY --from=builder --chown=runner:nodejs /app/.output .output
# COPY --from=builder --chown=runner:nodejs /app/node_modules node_modules
# COPY --from=builder --chown=runner:nodejs /app/package.json .
# COPY --from=builder --chown=runner:nodejs /app/.env .

# # Switch to non-root user
# USER runner

# # Expose application port
# EXPOSE 3000

# Use Tini as init system
# ENTRYPOINT ["/sbin/tini", "--"]

# Start the application with explicit host binding
CMD ["npm", "run", "start"]
