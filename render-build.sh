#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies for all workspaces including dev dependencies
# Override NODE_ENV temporarily for npm install to ensure dev dependencies are installed
NODE_ENV=development npm install

# Build shared package first
cd shared
npm run build
cd ..

# Build server package with explicit install of all dependencies
cd server
# Ensure dev dependencies are installed
NODE_ENV=development npm install
# Now set to production for the actual build
export NODE_ENV=production
npm run build
cd ..

# Output success message
echo "Build completed successfully!" 