@echo off
echo Neon Club Production Setup Guide
echo =================================
echo.

echo Current Setup: Development (10-50 users max)
echo Target: Production (1000+ users)
echo.

echo STEP 1: Database Migration (Required)
echo -------------------------------------
echo 1. Create MongoDB Atlas account (Free tier available)
echo 2. Create cluster and get connection string
echo 3. Update .env file with new MONGODB_URI
echo 4. Run: npm run migrate-data (if needed)
echo.

echo STEP 2: Server Deployment (Required)
echo ------------------------------------
echo Option A: Heroku (Easiest - $25/month)
echo   - heroku create neon-club-backend
echo   - git push heroku main
echo.
echo Option B: AWS EC2 (Scalable - $50/month)
echo   - Launch EC2 instance
echo   - Deploy with PM2
echo.
echo Option C: DigitalOcean (Balanced - $40/month)
echo   - Create droplet
echo   - Setup with Docker
echo.

echo STEP 3: Mobile App Update (Required)
echo ------------------------------------
echo 1. Update API_BASE_URL in config.js
echo 2. Change from local IP to production URL
echo 3. Example: https://neon-club-backend.herokuapp.com/api
echo.

echo STEP 4: Performance Optimization (Recommended)
echo ----------------------------------------------
echo 1. Add Redis caching ($15/month)
echo 2. Setup CDN for images ($10/month)
echo 3. Enable gzip compression
echo 4. Add rate limiting
echo.

echo Total Monthly Cost for 1000 users: $100-200
echo.
echo Press any key to continue...
pause >nul