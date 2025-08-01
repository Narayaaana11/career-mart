# Career Mart - Render Deployment Guide

## Overview
This guide will help you deploy your MERN stack application to Render. The application consists of:
- **Backend**: Node.js/Express API with MongoDB
- **Frontend**: React/Vite application

## Prerequisites
1. A Render account (free tier available)
2. A MongoDB database (MongoDB Atlas recommended)
3. Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Step 1: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

### Option B: Render MongoDB
1. In your Render dashboard, create a new MongoDB service
2. Use the provided connection string

## Step 2: Deploy Backend

1. **Connect Repository to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select the repository containing your project

2. **Configure Backend Service**
   - **Name**: `career-mart-backend`
   - **Root Directory**: `Career Mart Backend` (if your repo has this structure)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Set Environment Variables**
   - Click on "Environment" tab
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URI=your_mongodb_connection_string_here
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note the URL (e.g., `https://career-mart-backend.onrender.com`)

## Step 3: Deploy Frontend

1. **Create Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect the same Git repository

2. **Configure Frontend Service**
   - **Name**: `career-mart-frontend`
   - **Root Directory**: `Career Mart Frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

3. **Set Environment Variables**
   - Add this variable:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```
   - Replace `your-backend-url` with your actual backend URL

4. **Deploy**
   - Click "Create Static Site"
   - Wait for the build to complete

## Step 4: Update API Configuration

The frontend is already configured to use the `VITE_API_URL` environment variable. Make sure this points to your backend URL.

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test the job scraping functionality
3. Check that the API calls are working
4. Verify database connections

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check the build logs in Render
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **API Connection Issues**
   - Verify the `VITE_API_URL` environment variable
   - Check CORS settings in your backend
   - Ensure the backend is running

3. **Database Connection Issues**
   - Verify your MongoDB connection string
   - Check network access settings in MongoDB Atlas
   - Ensure the database user has correct permissions

4. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Restart the service after changing environment variables

### Useful Commands for Debugging:

```bash
# Check backend logs
# Available in Render dashboard under "Logs" tab

# Test API endpoints
curl https://your-backend-url.onrender.com/

# Check environment variables
# Available in Render dashboard under "Environment" tab
```

## Environment Variables Reference

### Backend Variables:
- `NODE_ENV`: Set to `production`
- `PORT`: Set to `10000` (Render will override this)
- `MONGO_URI`: Your MongoDB connection string

### Frontend Variables:
- `VITE_API_URL`: Your backend service URL

## Security Notes

1. **Environment Variables**: Never commit sensitive data like API keys or database URLs to your repository
2. **CORS**: Your backend already has CORS configured
3. **MongoDB**: Use MongoDB Atlas for better security and monitoring

## Cost Optimization

- Both services are on the free tier
- Free tier has limitations but is sufficient for development and small applications
- Monitor usage in your Render dashboard

## Next Steps

1. Set up custom domains (optional)
2. Configure monitoring and alerts
3. Set up CI/CD pipelines
4. Add SSL certificates (handled automatically by Render)

## Support

- Render Documentation: https://render.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Your application logs are available in the Render dashboard 