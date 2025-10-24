# Render Build Configuration
# This file helps optimize the build process on Render

# Build and deployment commands
# Build Command: npm ci && npm run build
# Start Command: npm start

# Environment Variables to set in Render dashboard:
# NODE_ENV=production
# VITE_API_BASE_URL=https://your-backend-api.onrender.com/api

# Expected build output: dist/spa/
# Server: http-server serving static files

echo "✅ Render configuration ready!"
echo "Build Command: npm ci && npm run build"
echo "Start Command: npm start"
echo "Don't forget to set VITE_API_BASE_URL in environment variables!"