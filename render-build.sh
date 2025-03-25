#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies for all workspaces including dev dependencies
# Override NODE_ENV temporarily for npm install to ensure dev dependencies are installed
NODE_ENV=development npm install

# Build shared package first
cd shared
npm run build
# Create a directory to store the shared dist files for use at runtime
mkdir -p ../server/node_modules/shared
# Copy the compiled shared files to the server's node_modules
cp -r dist/* ../server/node_modules/shared/
cd ..

# Build server package with explicit install of all dependencies
cd server
# Ensure dev dependencies are installed
NODE_ENV=development npm install
# Now set to production for the actual build
export NODE_ENV=production
# Run the build
npm run build

# Debug: Check if dist directory exists and what files it contains
echo "Checking build output..."
if [ -d "dist" ]; then
  echo "dist directory exists"
  ls -la dist
  
  if [ -d "dist/server/src" ]; then
    echo "dist/server/src directory exists"
    ls -la dist/server/src
    
    if [ -f "dist/server/src/main.js" ]; then
      echo "main.js exists in the correct location!"
    else
      echo "ERROR: main.js is missing from dist/server/src!"
      echo "Listing all files in dist recursively:"
      find dist -type f | grep main.js
    fi
  else
    echo "ERROR: dist/server/src directory is missing!"
    echo "Listing all files in dist recursively:"
    find dist -type f | sort
  fi
else
  echo "ERROR: dist directory is missing!"
  echo "Contents of current directory:"
  ls -la
fi

# Ensure the module-alias package.json settings are in the dist directory
echo "Setting up module aliases for production..."
if [ -d "dist/server/src" ]; then
  # Copy the _moduleAliases configuration to the dist/server folder
  node -e "const pkg = require('./package.json'); const fs = require('fs'); if(pkg._moduleAliases) { fs.writeFileSync('./dist/server/package.json', JSON.stringify({_moduleAliases: {shared: '../../../shared/dist'}}, null, 2)); console.log('Created module aliases in dist/server/package.json'); }"
fi

cd ..

# Output success message
echo "Build completed successfully!" 