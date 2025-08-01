#!/bin/bash

# Career Mart - Quick Deploy Script
# This script helps you prepare for deployment to Render

echo "🚀 Career Mart Deployment Helper"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found!"
    echo "Please initialize git and push your code to a repository first."
    exit 1
fi

# Check if code is committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes!"
    echo "Please commit and push your changes before deploying."
    echo ""
    echo "Run these commands:"
    echo "  git add ."
    echo "  git commit -m 'Prepare for deployment'"
    echo "  git push"
    exit 1
fi

echo "✅ Git repository is ready"
echo ""

# Check for required files
echo "📋 Checking required files..."

if [ ! -f "Career Mart Backend/package.json" ]; then
    echo "❌ Backend package.json not found"
    exit 1
fi

if [ ! -f "Career Mart Frontend/package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

echo "✅ All required files found"
echo ""

# Display deployment checklist
echo "📝 Deployment Checklist:"
echo "========================"
echo ""
echo "1. MongoDB Setup:"
echo "   - Create MongoDB Atlas account"
echo "   - Create a cluster"
echo "   - Create database user"
echo "   - Get connection string"
echo ""
echo "2. Render Setup:"
echo "   - Create Render account"
echo "   - Connect your Git repository"
echo ""
echo "3. Backend Deployment:"
echo "   - Create Web Service"
echo "   - Root Directory: Career Mart Backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Environment Variables:"
echo "     * NODE_ENV=production"
echo "     * PORT=10000"
echo "     * MONGO_URI=your_mongodb_connection_string"
echo ""
echo "4. Frontend Deployment:"
echo "   - Create Static Site"
echo "   - Root Directory: Career Mart Frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: dist"
echo "   - Environment Variables:"
echo "     * VITE_API_URL=https://your-backend-url.onrender.com"
echo ""
echo "5. Testing:"
echo "   - Test backend URL"
echo "   - Test frontend URL"
echo "   - Test job scraping functionality"
echo ""

echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Set up MongoDB Atlas: https://www.mongodb.com/atlas"
echo "2. Deploy to Render: https://dashboard.render.com"
echo "3. Follow the detailed guide in DEPLOYMENT_GUIDE.md"
echo "4. Use the checklist in deploy-checklist.md"
echo ""

echo "📚 Useful Links:"
echo "================"
echo "- Render Documentation: https://render.com/docs"
echo "- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com"
echo "- Your deployment guide: DEPLOYMENT_GUIDE.md"
echo ""

echo "✅ You're ready to deploy!"
echo "Good luck! 🚀" 