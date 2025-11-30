# Deploy to Vercel - Fixed for Serverless

## The Problem
SQLite doesn't work on Vercel because Vercel is serverless (no persistent filesystem).

## Solution: Use Free PostgreSQL

### Option 1: Neon (Easiest Free PostgreSQL)

#### Step 1: Create Free Neon Database
1. Go to https://neon.tech
2. Sign up with GitHub (free)
3. Click "Create Project"
4. Name it "boardsignal"
5. Choose region closest to you
6. Click "Create Project"
7. **Copy the connection string** (looks like: `postgresql://...`)

#### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Select your `founder` repository
5. **Before clicking Deploy**, add Environment Variables:
   - `DATABASE_URL` = paste the Neon connection string
   - `NEWS_API_KEY` = (optional) your NewsAPI key
6. Click "Deploy"
7. Wait 2-3 minutes

#### Step 3: Run Database Migration
After deployment succeeds:
1. In Vercel, go to your project
2. Click "Settings" → "Functions"
3. Go back to "Deployments"
4. Find your deployment
5. Click the three dots → "View Function Logs"
6. The Prisma migration should have run automatically

**Your app is now live!** Visit the URL Vercel gives you.

---

### Option 2: Supabase (Another Free Option)

#### Step 1: Create Supabase Database
1. Go to https://supabase.com
2. Sign up with GitHub
3. Click "New Project"
4. Name: "boardsignal"
5. Create a strong database password (save it!)
6. Choose region
7. Click "Create new project" (takes ~2 minutes)

#### Step 2: Get Connection String
1. Click "Project Settings" (gear icon)
2. Click "Database"
3. Scroll to "Connection string" → "URI"
4. Copy it
5. Replace `[YOUR-PASSWORD]` with your actual password

#### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Import your repository
3. Add Environment Variable:
   - `DATABASE_URL` = your Supabase connection string
4. Deploy!

---

### Option 3: Vercel Postgres (Paid after 256MB)

1. In Vercel project, click "Storage"
2. Click "Create Database"
3. Select "Postgres"
4. Name it "boardsignal"
5. Click "Create"
6. Database URL is automatically added to your environment

---

## Update Prisma Schema for PostgreSQL

You need to update one line in `prisma/schema.prisma`:

**Before:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**After:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then commit and push:
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

Vercel will auto-deploy the update!

---

## Quick Start Commands

```bash
# 1. Update Prisma schema
# Edit prisma/schema.prisma - change "sqlite" to "postgresql"

# 2. Commit change
git add prisma/schema.prisma
git commit -m "Use PostgreSQL for production"
git push

# 3. Deploy to Vercel with your DATABASE_URL
# (from Neon or Supabase)
```

---

## Troubleshooting

### "P1001: Can't reach database server"
- Your DATABASE_URL is wrong
- Check it's the full connection string
- Make sure database is running

### "Table doesn't exist"
- Migrations didn't run
- In Vercel project settings, add build command:
  - `prisma generate && prisma migrate deploy && next build`

### Still getting 404?
1. Check deployment logs in Vercel
2. Make sure build succeeded (green checkmark)
3. Check Functions logs for errors

---

## Free Tier Limits

**Neon:**
- ✓ 0.5 GB storage
- ✓ Good for ~10,000 companies
- ✓ No credit card required

**Supabase:**
- ✓ 500 MB storage
- ✓ 2 GB data transfer/month
- ✓ No credit card required

**Vercel Postgres:**
- ✓ 256 MB storage (then paid)
- ✓ Requires credit card

---

## Success Checklist

- [ ] Created PostgreSQL database (Neon/Supabase)
- [ ] Got connection string
- [ ] Updated prisma/schema.prisma to use "postgresql"
- [ ] Committed and pushed changes
- [ ] Added DATABASE_URL to Vercel
- [ ] Deployed successfully
- [ ] App loads without errors
- [ ] Can add companies and see news

Done! Your app is live on Vercel with a real database! 🎉
