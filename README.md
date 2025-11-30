# BoardSignal

A minimal, production-ready web app for VC/PE professionals who sit on boards or have private investments. Track news signals for your portfolio companies with impact scoring.

## Features

- **Company Following**: Track multiple companies by name and ticker
- **Unified News Feed**: Single feed aggregating news from all followed companies
- **Impact Scoring**: Each article gets an automatic impact score (0-10) based on keywords and patterns
- **Clean UI**: Professional, responsive design suitable for busy investors
- **Flexible Data Source**: Works with mock data out-of-the-box, or connect to NewsAPI for real news

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + React
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **API**: Next.js API routes
- **News Source**: NewsAPI.org (optional)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Initialize the database and run migrations:

```bash
npx prisma migrate dev --name init
```

This will:
- Create a SQLite database file at `prisma/dev.db`
- Generate the Prisma Client
- Apply the database schema

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will work immediately with **mock data** - no additional configuration needed!

## Using Real News Data (Optional)

To fetch real news instead of mock data:

1. **Get a NewsAPI.org API key**:
   - Visit [https://newsapi.org/register](https://newsapi.org/register)
   - Sign up for a free account
   - Copy your API key

2. **Configure the API key**:
   - Create a `.env` file in the root directory (or edit the existing one)
   - Add your API key:

   ```env
   NEWS_API_KEY=your_actual_api_key_here
   ```

3. **Restart the dev server**:

   ```bash
   npm run dev
   ```

The app will automatically detect the API key and start fetching real news!

## How It Works

### Authentication

BoardSignal uses a simple localStorage-based authentication:
- On first visit, a unique user ID is generated and stored in your browser
- A user record is created in the database with email `anonymous+<uuid>@boardsignal.app`
- No passwords or login forms required

### Following Companies

1. Enter a company name (required) and ticker symbol (optional)
2. Click "Follow Company"
3. The company is added to your followed list
4. News for that company appears in your feed

### Impact Scoring

Each news article is automatically scored from 0-10 based on:

- **Base score**: 3 points
- **High-impact keywords** (+4 points): acquisition, merger, funding, Series A/B/C, layoffs, CEO, board, investigation, bankruptcy, IPO, etc.
- **Financial amounts** (+2 points): Mentions of $X million/billion
- **Multiple keywords** (+1 point): Articles with multiple high-impact keywords

**Score ranges:**
- **0-3**: Low impact (green)
- **4-7**: Medium impact (yellow)
- **8-10**: High impact (red)

## Project Structure

```
boardsignal/
├── app/
│   ├── api/
│   │   ├── companies/
│   │   │   ├── route.ts          # GET, POST companies
│   │   │   └── [id]/route.ts     # DELETE company follow
│   │   └── news/
│   │       └── route.ts          # GET news feed
│   ├── globals.css               # Tailwind styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── AddCompanyForm.tsx        # Form to follow companies
│   ├── CompanyList.tsx           # List of followed companies
│   ├── NewsCard.tsx              # Individual news article
│   └── NewsFeed.tsx              # News feed container
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── types.ts                  # TypeScript interfaces
│   ├── impactScoring.ts          # Impact scoring engine
│   └── newsFetcher.ts            # News API integration
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── dev.db                    # SQLite database (generated)
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
└── README.md                     # This file
```

## Database Schema

### User
- `id`: UUID
- `email`: String (unique)
- `createdAt`: DateTime

### Company
- `id`: UUID
- `name`: String
- `ticker`: String (optional)
- `createdAt`: DateTime

### UserCompanyFollow
- `id`: UUID
- `userId`: References User
- `companyId`: References Company
- `createdAt`: DateTime

## API Endpoints

### `GET /api/companies?userId=<uuid>`
Returns all companies followed by the user.

**Response:**
```json
{
  "companies": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "ticker": "ACME",
      "createdAt": "2025-11-30T..."
    }
  ]
}
```

### `POST /api/companies`
Follow a new company.

**Request:**
```json
{
  "userId": "uuid",
  "name": "Acme Corp",
  "ticker": "ACME"  // optional
}
```

**Response:**
```json
{
  "company": {
    "id": "uuid",
    "name": "Acme Corp",
    "ticker": "ACME",
    "createdAt": "2025-11-30T..."
  }
}
```

### `DELETE /api/companies/:id?userId=<uuid>`
Unfollow a company.

**Response:**
```json
{
  "success": true
}
```

### `GET /api/news?userId=<uuid>`
Get news feed for all followed companies, sorted by impact score.

**Response:**
```json
{
  "news": [
    {
      "id": "uuid",
      "companyId": "uuid",
      "companyName": "Acme Corp",
      "title": "Acme Corp raises $50M Series B",
      "source": "TechCrunch",
      "url": "https://...",
      "publishedAt": "2025-11-28T...",
      "description": "Acme Corp has successfully...",
      "impactScore": 9
    }
  ]
}
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)

# Linting
npm run lint         # Run Next.js linter
```

## Environment Variables

Create a `.env` file with:

```env
# Database (automatically set)
DATABASE_URL="file:./dev.db"

# News API (optional)
NEWS_API_KEY=your_api_key_here
```

## Development Tips

### Viewing the Database

Use Prisma Studio to view and edit database records:

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555`

### Resetting the Database

To start fresh:

```bash
rm prisma/dev.db
npx prisma migrate dev --name init
```

### Testing Without an API Key

The app is designed to work perfectly without a NewsAPI key. Mock data is automatically generated for each company you follow, allowing you to:
- Test the UI
- See how impact scoring works
- Demo the app to others
- Develop new features

## Production Deployment

### Build the App

```bash
npm run build
```

### Environment Variables for Production

Set these in your hosting platform:

```env
DATABASE_URL="file:./dev.db"  # Or use PostgreSQL/MySQL for production
NEWS_API_KEY=your_production_api_key
```

### Recommended Hosting

- **Vercel**: Zero-config deployment for Next.js
- **Railway**: Supports SQLite and PostgreSQL
- **Render**: Easy deployment with database options

**Note**: For production at scale, consider migrating from SQLite to PostgreSQL or MySQL by updating the Prisma schema.

## Customization

### Adjusting Impact Scoring

Edit `lib/impactScoring.ts` to modify:
- Keywords that trigger high scores
- Point values for different patterns
- Score calculation logic

### Changing News Sources

Edit `lib/newsFetcher.ts` to:
- Add alternative news APIs
- Customize query parameters
- Adjust article limits

### UI Styling

All components use Tailwind CSS. Modify styles in:
- Component files (`components/*.tsx`)
- Global styles (`app/globals.css`)
- Tailwind config (`tailwind.config.ts`)

## Troubleshooting

### "Prisma Client not generated"

Run:
```bash
npx prisma generate
```

### Database connection errors

Ensure you've run migrations:
```bash
npx prisma migrate dev --name init
```

### News not loading

Check:
1. Is `NEWS_API_KEY` set correctly in `.env`?
2. Is your API key valid? Test at [newsapi.org](https://newsapi.org)
3. Check the browser console for errors

### Mock data not showing

This usually means:
1. You haven't followed any companies yet, or
2. There's a JavaScript error (check browser console)

## License

MIT

## Support

For issues or questions:
1. Check this README
2. Review the code comments
3. Open an issue on GitHub

---

Built with Next.js, TypeScript, Prisma, and Tailwind CSS.
