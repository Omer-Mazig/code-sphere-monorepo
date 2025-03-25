#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies in the root (which will install for all workspaces)
npm install

# Build everything in the correct order
npm run build 