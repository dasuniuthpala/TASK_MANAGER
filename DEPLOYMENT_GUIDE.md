# Railway Deployment Instructions

## Steps to Deploy Backend on Railway:

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login with GitHub**
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your TASK_MANAGER repository**
5. **Configure Environment Variables:**
   - MONGO_URL: your MongoDB connection string
   - JWT_SECRET: your JWT secret
   - PORT: 4000 (Railway will override this)

6. **Railway will automatically:**
   - Detect your Node.js app
   - Install dependencies
   - Deploy your backend
   - Give you a URL like: `https://your-app-name.railway.app`

7. **Update your frontend env file with the Railway URL**

## Alternative: Render.com (Also Free)

1. Go to [Render.com](https://render.com)
2. Connect GitHub account
3. Create "Web Service"
4. Select your repository
5. Configure environment variables
6. Deploy

## Alternative: Heroku (Has free tier)

1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Set environment variables
4. Deploy with: `git push heroku main`
