#!/usr/bin/env bash
# Exit on error
set -o errexit

# Build the shared package first
cd ../shared
npm install
npm run build

# Return to server directory and build it
cd ../server
npm install
npm run build 