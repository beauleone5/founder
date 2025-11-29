# Deployment Guide - Founder Radar

Quick deployment guide for Railway and Render.

---

## 🚂 Railway Deployment (Recommended - Easiest!)

### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)

### Step 2: Deploy from GitHub

#### Option A: Use Railway Dashboard (Easiest)
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose repository: `beauleone5/founder`
4. Select branch: `claude/founder-radar-backend-01X76CqjPfwjPSYovz94hdE2`
5. Railway will auto-detect Node.js and deploy!

#### Option B: Use Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd founder-radar
railway init

# Link to GitHub repo
railway link

# Deploy
railway up
```

### Step 3: Add PostgreSQL Database
1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway automatically sets `DATABASE_URL` environment variable
4. Your app will connect automatically!

### Step 4: Set Environment Variables
1. Click on your service
2. Go to **"Variables"** tab
3. Add these variables:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   PERPLEXITY_API_KEY=(optional)
   NODE_ENV=production
   WEEKLY_REPORT_CRON=0 9 * * 1
   ```

### Step 5: Run Migrations
1. Go to your service
2. Click **"Settings"** → **"Deploy"**
3. Add custom deploy command:
   ```bash
   npm install && npm run build && npm run migrate && npm start
   ```

Or run manually:
```bash
railway run npm run migrate
```

### Step 6: Get Your URL
- Railway will provide a public URL like: `https://founder-radar.up.railway.app`
- Test it: `curl https://your-url.railway.app/api/health`

### Railway Costs
- **Free Tier:** $5/month in credits
- **Starter Plan:** $20/month (more resources)
- Estimated usage: ~$3-5/month for this app

---

## 🎨 Render Deployment

### Step 1: Sign Up
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `beauleone5/founder`
3. Select branch: `claude/founder-radar-backend-01X76CqjPfwjPSYovz94hdE2`
4. Configure:
   ```
   Name: founder-radar-api
   Region: Oregon (US West)
   Branch: claude/founder-radar-backend-01X76CqjPfwjPSYovz94hdE2
   Root Directory: founder-radar
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

### Step 3: Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   ```
   Name: founder-radar-db
   Database: founder_radar
   User: founder_radar_user
   Region: Oregon (same as web service)
   Plan: Free
   ```
3. Wait for database to provision (2-3 minutes)

### Step 4: Connect Database to Web Service
1. Go back to your Web Service
2. Click **"Environment"** tab
3. Add environment variable:
   ```
   DATABASE_URL: (copy Internal Database URL from PostgreSQL service)
   ```

### Step 5: Set Environment Variables
Add these in the **Environment** tab:
```
NODE_ENV=production
PORT=3000
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PERPLEXITY_API_KEY=(optional)
WEEKLY_REPORT_CRON=0 9 * * 1
DB_HOST=(copy from database)
DB_PORT=5432
DB_NAME=founder_radar
DB_USER=(copy from database)
DB_PASSWORD=(copy from database)
```

### Step 6: Run Migrations
Go to **Shell** tab in your web service and run:
```bash
npm run migrate
```

Or add to build command:
```bash
npm install && npm run build && npm run migrate
```

### Step 7: Get Your URL
- Render provides URL like: `https://founder-radar-api.onrender.com`
- Test: `curl https://your-url.onrender.com/api/health`

### Render Costs
- **Free Tier:** Available (with limitations)
  - Spins down after 15 min of inactivity
  - 750 hours/month free
- **Starter Plan:** $7/month (always on)
- **PostgreSQL Free:** 90 days, then $7/month

---

## 🆚 Railway vs Render Comparison

| Feature | Railway | Render |
|---------|---------|--------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐⭐ Easy |
| **Free Tier** | $5 credits/month | 750 hours + sleeps |
| **Always On** | ✅ Yes (with credits) | ❌ No (unless paid) |
| **Database Included** | ✅ Auto-setup | ✅ Manual setup |
| **Price (Paid)** | $20/month | $7/month |
| **Speed** | ⚡ Faster deploys | 🐢 Slower deploys |

**Recommendation:** Use **Railway** for easiest setup and best free tier!

---

## ✅ Post-Deployment Checklist

After deploying to either platform:

- [ ] Verify health endpoint: `curl https://your-url/api/health`
- [ ] Test config endpoint: `curl https://your-url/api/config`
- [ ] Verify database connection (check logs)
- [ ] Run initial founder fetch: `curl -X POST https://your-url/api/founders/fetch`
- [ ] Test AI enrichment: `curl -X POST https://your-url/api/founders/enrich-all`
- [ ] View top 10: `curl https://your-url/api/founders/top10`
- [ ] Set up monitoring (Railway/Render dashboards)
- [ ] Configure custom domain (optional)

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Re-run migrations
npm run migrate
```

### Build Failures
- Check Node.js version (should be 18+)
- Verify package.json scripts
- Check build logs for errors

### App Won't Start
- Check environment variables are set
- Verify DATABASE_URL format
- Check logs for specific errors

---

## 📊 Monitoring

### Railway
- Built-in metrics dashboard
- Real-time logs
- Usage tracking

### Render
- Metrics tab (CPU, memory)
- Logs tab (real-time)
- Events history

---

## 🚀 Next Steps After Deployment

1. **Test the API** - Fetch real founder data
2. **Set up monitoring** - Watch for errors
3. **Configure alerts** - Get notified of issues
4. **Add custom domain** - Use your own domain
5. **Build frontend** - Create UI to visualize data
6. **Schedule reports** - Set up weekly emails

---

## 💡 Pro Tips

- **Use Railway for development** - Easier, faster
- **Switch to Render for production** - Cheaper for always-on
- **Monitor API costs** - Anthropic API usage can add up
- **Set up backups** - Export database weekly
- **Use environment branches** - Separate staging/production

---

**Need help?** Check the logs in your platform's dashboard or reach out for support!
