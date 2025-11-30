# How to Deploy BoardSignal - Step by Step

## Option 1: Vercel (Easiest - 5 minutes)

Vercel is made by the same people who make Next.js. It's the easiest option.

### Step 1: Push Your Code to GitHub

Your code is already on GitHub in this repo!

### Step 2: Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Click "Continue with GitHub"
4. Log in with your GitHub account
5. Click "Authorize Vercel"

### Step 3: Deploy Your Project

1. Once logged in to Vercel, click "Add New..." button (top right)
2. Click "Project"
3. Find your `founder` repository in the list
4. Click "Import"
5. Vercel will auto-detect it's a Next.js app
6. **IMPORTANT**: Click "Environment Variables" section
7. Add these:
   - Key: `DATABASE_URL`
   - Value: `file:./dev.db`
8. Click "Deploy"
9. Wait 2-3 minutes for deployment to finish

### Step 4: Get Your Live URL

Once deployed, Vercel gives you a URL like:
- `https://founder-yourname.vercel.app`

Click it and your app is LIVE!

### Step 5 (Optional): Add Real News

1. Get API key from https://newsapi.org/register
2. In Vercel dashboard, go to your project
3. Click "Settings" tab
4. Click "Environment Variables"
5. Click "Add Another"
6. Add:
   - Key: `NEWS_API_KEY`
   - Value: `your_actual_api_key_here`
7. Click "Save"
8. Go to "Deployments" tab
9. Click the three dots (...) on latest deployment
10. Click "Redeploy"

Done! Your app now has real news.

---

## Option 2: Railway (For More Control)

Railway is good if you want a more traditional hosting setup.

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login"
3. Click "Login with GitHub"
4. Authorize Railway

### Step 2: Create New Project

1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Click "Configure GitHub App"
4. Give Railway access to your repositories
5. Select your `founder` repository
6. Railway will start deploying automatically

### Step 3: Add Environment Variables

1. In your Railway project, click on the service (should say "founder")
2. Click "Variables" tab
3. Click "New Variable"
4. Add:
   - `DATABASE_URL` = `file:./dev.db`
5. Click "New Variable" again
6. Add (optional):
   - `NEWS_API_KEY` = `your_api_key` (from newsapi.org)

### Step 4: Configure Build

1. Click "Settings" tab
2. Scroll to "Build Command"
3. Make sure it says: `npm run build`
4. Scroll to "Start Command"
5. Make sure it says: `npm start`
6. Click "Deploy" button at top

### Step 5: Get Your URL

1. Click "Settings" tab
2. Scroll to "Networking"
3. Click "Generate Domain"
4. Your app will be at: `https://yourapp.up.railway.app`

Done!

---

## Option 3: Render (Free Tier Available)

### Step 1: Sign Up

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub
4. Authorize Render

### Step 2: Create Web Service

1. Click "New +"
2. Click "Web Service"
3. Connect your `founder` repository
4. Click "Connect"

### Step 3: Configure Service

Fill in these settings:

- **Name**: `boardsignal` (or whatever you want)
- **Region**: Choose closest to you
- **Branch**: `claude/build-boardsignal-app-01JxkZ1U14pQTxLJzXjpCQ3z`
- **Runtime**: `Node`
- **Build Command**: `npm install && npx prisma migrate deploy && npm run build`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables

Scroll down to "Environment Variables":

1. Click "Add Environment Variable"
2. Add:
   - Key: `DATABASE_URL`
   - Value: `file:./dev.db`
3. Click "Add Environment Variable" again
4. Add (optional):
   - Key: `NEWS_API_KEY`
   - Value: your API key from newsapi.org

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Your URL will be shown at top: `https://boardsignal.onrender.com`

Done!

---

## Which Option Should You Choose?

**Choose Vercel if:**
- ✓ You want the easiest deployment
- ✓ You want automatic deployments on every git push
- ✓ You're okay with mock news data for now
- ✓ You want the fastest option (5 minutes)

**Choose Railway if:**
- ✓ You want more control over your hosting
- ✓ You might want to add a real database later (PostgreSQL)
- ✓ You want good performance

**Choose Render if:**
- ✓ You want a completely free option
- ✓ You don't mind slightly slower deploys
- ✓ You want a middle ground between Vercel and Railway

---

## Important Notes About Production

### Database in Production

Right now, your app uses SQLite (a file-based database). This works but has limitations:

**For small/demo use**: SQLite is fine
**For real production**: You should upgrade to PostgreSQL

### Upgrading to PostgreSQL (Later)

If you get real users, follow these steps:

1. In Railway or Render, click "New Database" → "PostgreSQL"
2. Copy the connection string (looks like: `postgresql://user:pass@host:5432/db`)
3. Change your `DATABASE_URL` environment variable to this new string
4. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // change from sqlite
     url      = env("DATABASE_URL")
   }
   ```
5. Run: `npx prisma migrate dev`
6. Redeploy

But you don't need this yet! Start with SQLite.

---

## Testing Your Deployment

Once deployed, test these things:

1. ✓ Can you open the website?
2. ✓ Can you add a company? (Try "Apple" with ticker "AAPL")
3. ✓ Do you see mock news articles appear?
4. ✓ Can you remove a company?
5. ✓ Do the impact scores show correctly?

If all 5 work, you're good!

---

## Troubleshooting

### "Application Error" or "500 Error"

1. Check the logs in your hosting platform
2. Make sure `DATABASE_URL` environment variable is set
3. Make sure Prisma migrations ran (check build logs)

### "No news showing"

- This is normal! You need to follow a company first
- Mock data should appear automatically
- If it doesn't, check browser console for errors (F12)

### "Build Failed"

1. Check build logs in your hosting platform
2. Common issue: Missing environment variables
3. Make sure `DATABASE_URL=file:./dev.db` is set

### "Database errors"

1. In your hosting platform, find the "Console" or "Shell"
2. Run: `npx prisma migrate deploy`
3. This will fix database issues

---

## Getting a Custom Domain (Optional)

### On Vercel:
1. Buy domain from Namecheap, Google Domains, etc.
2. In Vercel project → Settings → Domains
3. Add your domain (like `boardsignal.com`)
4. Follow DNS instructions
5. Done!

### On Railway:
1. Click Settings → Networking
2. Click "Custom Domain"
3. Enter your domain
4. Update DNS records at your domain provider

### On Render:
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS at your domain provider

---

## Need Help?

If you get stuck:

1. Check the logs in your hosting platform
2. Make sure all environment variables are set
3. Try redeploying
4. Check that your git branch is pushed to GitHub

---

## Quick Reference - Environment Variables

All platforms need these:

```
DATABASE_URL=file:./dev.db
```

Optional (for real news):

```
NEWS_API_KEY=your_key_from_newsapi.org
```

That's it! Just those two.

---

## Success Checklist

- [ ] Signed up for hosting platform (Vercel/Railway/Render)
- [ ] Connected GitHub account
- [ ] Selected the `founder` repository
- [ ] Added `DATABASE_URL` environment variable
- [ ] Deployed successfully
- [ ] Tested adding a company
- [ ] Saw news articles appear
- [ ] Got my live URL
- [ ] (Optional) Added `NEWS_API_KEY` for real news
- [ ] (Optional) Set up custom domain

Once all checked, you're live! 🚀
