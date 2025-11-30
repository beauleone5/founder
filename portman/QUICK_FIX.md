# Quick Fix for 404 Error on Vercel

## Problem
You got a 404 error because **SQLite doesn't work on Vercel**.

## 2-Minute Fix

### Step 1: Get Free Database (Pick One)

**Option A: Neon (Recommended)**
1. Go to https://console.neon.tech
2. Sign in with GitHub
3. Create new project "boardsignal"
4. Copy the connection string

**Option B: Supabase**
1. Go to https://supabase.com/dashboard
2. New project "boardsignal"
3. Set password
4. Copy connection string from Settings → Database

### Step 2: Update Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click your "founder" project
3. Click "Settings"
4. Click "Environment Variables"
5. Find `DATABASE_URL` or add it:
   - Name: `DATABASE_URL`
   - Value: (paste the connection string from Neon/Supabase)
6. Click "Save"

### Step 3: Update Code

Run these commands:

```bash
# Update Prisma to use PostgreSQL
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())

  follows UserCompanyFollow[]

  @@map("users")
}

model Company {
  id        String   @id @default(uuid())
  name      String
  ticker    String?
  createdAt DateTime @default(now())

  followers UserCompanyFollow[]

  @@map("companies")
}

model UserCompanyFollow {
  id        String   @id @default(uuid())
  userId    String
  companyId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([userId, companyId])
  @@map("user_company_follows")
}
EOF

# Commit and push
git add .
git commit -m "Switch to PostgreSQL for Vercel deployment"
git push
```

### Step 4: Redeploy

Vercel will automatically redeploy. Wait 2 minutes, then visit your URL again.

**It should work now!** ✓

---

## Alternative: Use Railway Instead

If you want to stick with the current code (SQLite):

1. Cancel Vercel deployment
2. Go to https://railway.app
3. Deploy from GitHub
4. Railway supports SQLite out of the box

Railway is actually better for SQLite. Vercel is better for serverless.

---

## What Changed?

- ❌ Before: SQLite (file-based) - doesn't work on Vercel
- ✅ After: PostgreSQL (cloud-based) - works everywhere

Your app will still work locally if you:
1. Keep `DATABASE_URL=file:./dev.db` in your local `.env`
2. Change it to PostgreSQL URL only in Vercel

Or just use PostgreSQL everywhere - it's better anyway!
