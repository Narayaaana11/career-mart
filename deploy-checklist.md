# Deployment Checklist

## Pre-Deployment
- [ ] Code is committed and pushed to Git repository
- [ ] MongoDB Atlas account created
- [ ] MongoDB database and user configured
- [ ] MongoDB connection string ready
- [ ] Render account created

## Backend Deployment
- [ ] Create new Web Service in Render
- [ ] Connect Git repository
- [ ] Set root directory to "Career Mart Backend"
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `npm start`
- [ ] Set environment variables:
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] MONGO_URI=your_mongodb_connection_string
- [ ] Deploy and wait for build completion
- [ ] Test backend URL (should show "Career Mart API is running")
- [ ] Note the backend URL for frontend configuration

## Frontend Deployment
- [ ] Create new Static Site in Render
- [ ] Connect same Git repository
- [ ] Set root directory to "Career Mart Frontend"
- [ ] Configure build command: `npm install && npm run build`
- [ ] Set publish directory to `dist`
- [ ] Set environment variable:
  - [ ] VITE_API_URL=https://your-backend-url.onrender.com
- [ ] Deploy and wait for build completion
- [ ] Test frontend URL

## Post-Deployment Testing
- [ ] Visit frontend URL
- [ ] Test job scraping functionality
- [ ] Test API calls
- [ ] Verify database connections
- [ ] Check for any console errors
- [ ] Test responsive design on mobile

## Troubleshooting
- [ ] Check Render logs for build errors
- [ ] Verify environment variables are set correctly
- [ ] Test API endpoints directly
- [ ] Check MongoDB connection
- [ ] Verify CORS settings

## Notes
- Backend URL: ________________
- Frontend URL: ________________
- MongoDB Connection String: ________________ 