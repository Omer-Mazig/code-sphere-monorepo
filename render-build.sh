#!/usr/bin/env bash
# Exit on error
set -o errexit

# Set NODE_ENV to production
export NODE_ENV=production

# Install dependencies for all workspaces
npm install

# Build shared package first
cd shared
npm run build
cd ..

# Build server package
cd server
npm run build
cd ..

# Output success message
echo "Build completed successfully!" 