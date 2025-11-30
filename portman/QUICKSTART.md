# BoardSignal - Quick Start

Get BoardSignal running in 3 minutes.

## 1. Install Dependencies

```bash
cd portman
npm install
```

## 2. Set Up Database

```bash
npx prisma migrate dev --name init
```

This creates a SQLite database file at `prisma/dev.db`.

## 3. Run the App

```bash
npm run dev
```

Open http://localhost:3000

**That's it!** The app works with mock data out of the box.

---

## Try It Out

1. Add a company (e.g., "Apple" with ticker "AAPL")
2. See mock news articles appear
3. Notice the impact scores (0-10) on each article
4. Try adding more companies

---

## Next Steps

### Want Real News?

1. Get free API key: https://newsapi.org/register
2. Add to `.env`:
   ```env
   NEWS_API_KEY=your_key_here
   ```
3. Restart the server

### Deploy to Production

See [DEPLOY.md](./DEPLOY.md) for full deployment guides.

**Quick deploy:**
- Vercel: See [QUICK_FIX.md](./QUICK_FIX.md) for PostgreSQL setup
- Railway: Supports SQLite out-of-the-box
- Render: See [DEPLOY.md](./DEPLOY.md)

---

## Troubleshooting

**"Prisma Client not generated"**
```bash
npx prisma generate
```

**"Database doesn't exist"**
```bash
npx prisma migrate dev --name init
```

**Port 3000 already in use**
```bash
PORT=3001 npm run dev
```

---

## Project Structure

```
portman/
├── app/              # Next.js pages & API routes
│   ├── api/
│   │   ├── companies/   # Company following endpoints
│   │   └── news/        # News feed endpoint
│   └── page.tsx         # Main dashboard
├── components/       # React UI components
├── lib/             # Business logic
│   ├── impactScoring.ts  # Impact score calculator
│   ├── newsFetcher.ts    # News API integration
│   └── prisma.ts         # Database client
├── prisma/          # Database
│   └── schema.prisma     # DB schema
└── README.md        # Full documentation
```

---

## Common Commands

```bash
# Development
npm run dev                    # Start dev server

# Database
npx prisma studio              # View database in browser
npx prisma migrate dev         # Create new migration
npx prisma generate            # Regenerate Prisma Client

# Production
npm run build                  # Build for production
npm start                      # Start production server
```

---

## Features

✓ Company following (by name + ticker)
✓ Unified news feed
✓ Impact scoring (0-10)
✓ Works with mock data
✓ Optional NewsAPI integration
✓ Clean, responsive UI
✓ Production-ready

---

Need help? See [README.md](./README.md) for full documentation.
