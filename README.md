# Career Mart

A comprehensive job search platform with advanced features like job scraping, alerts, and comparison tools.

## Project Structure

```
Career Mart/
├── Career Mart Backend/     # Express.js API server
├── Career Mart Frontend/    # React + Vite frontend
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd "Career Mart Backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/career-mart
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd "Career Mart Frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory (optional):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_DEV_MODE=true
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs with optional filters
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/save-job` - Save job to user's saved jobs
- `DELETE /api/users/:id/save-job/:jobId` - Remove job from saved jobs
- `GET /api/users/:id/saved-jobs` - Get user's saved jobs
- `POST /api/users/:id/view-job` - Add job to recently viewed
- `GET /api/users/:id/recently-viewed` - Get recently viewed jobs
- `POST /api/users/:id/compare-job` - Add job to compare list
- `DELETE /api/users/:id/compare-job/:jobId` - Remove job from compare list
- `GET /api/users/:id/compare-jobs` - Get user's compare jobs

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get alert by ID
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### Job Scraping
- `POST /api/scrape-jobs` - Scrape jobs from external sources

## Frontend Features

### Components
- **JobCard**: Display individual job information
- **JobComparison**: Compare multiple jobs side by side
- **JobAlerts**: Manage job alerts and notifications
- **SearchFilters**: Advanced job search filters
- **RecentlyViewed**: Track recently viewed jobs
- **TrendingJobs**: Show trending job opportunities

### Pages
- **Landing Page**: Homepage with hero section and features
- **Jobs Page**: Job listing with search and filters
- **Saved Jobs**: User's saved job listings
- **Job Details**: Detailed job information

## Development

### Backend Development
- The backend uses Express.js with MongoDB
- CORS is enabled for frontend communication
- API routes are organized by feature (jobs, users, alerts, scrape)
- Environment variables are used for configuration

### Frontend Development
- Built with React + TypeScript + Vite
- Uses React Query for data fetching and caching
- Styled with Tailwind CSS and shadcn/ui components
- Proxy configuration for API calls during development

### API Integration
- Frontend uses axios for HTTP requests
- React Query provides caching and state management
- Custom hooks for API calls with proper error handling
- TypeScript interfaces for type safety

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/career-mart
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_DEV_MODE=true
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration allows requests from the frontend origin
2. **MongoDB Connection**: Make sure MongoDB is running and the connection string is correct
3. **Port Conflicts**: Check if ports 3000 (frontend) and 5000 (backend) are available
4. **API Calls Failing**: Verify the proxy configuration in `vite.config.ts`

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reloading during development
2. **API Testing**: Use tools like Postman or Thunder Client to test API endpoints
3. **Database**: Use MongoDB Compass for database management
4. **Logs**: Check console logs for both frontend and backend for debugging

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up environment variables
4. Use PM2 or similar for process management

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 