# 🚀 Founder Radar

A comprehensive VC sourcing engine that discovers, filters, enriches, scores, and ranks early-stage founders from multiple public sources.

## Overview

Founder Radar helps VC firms identify promising early-stage founders by:

- **Aggregating** data from multiple sources (ProductHunt, HackerNews, GitHub, etc.)
- **Enriching** founder profiles using AI-powered analysis
- **Scoring** founders based on customizable criteria
- **Filtering** founders by university, location, niche, and technical background
- **Generating** weekly "Top 10 Founders" reports

## Features

### 🎯 Multi-Source Data Collection
- ProductHunt launches
- HackerNews "Show HN" posts
- GitHub trending repositories
- University pipeline (via Perplexity API)
- Manual founder input
- Y Combinator directory (extensible)

### 🤖 AI-Powered Enrichment
- Comprehensive founder bio generation
- Execution velocity scoring (0-25)
- Technical depth assessment (0-25)
- Market potential analysis (0-20)
- Momentum signals tracking
- Risk analysis
- Personalized outreach email templates

### ⚖️ Customizable Scoring System
- Configurable weights for different criteria
- Execution velocity: 25%
- Technical depth: 25%
- Momentum score: 20%
- Market potential: 20%
- Credibility: 10%

### 🔍 Advanced Filtering
- University filter
- Age range
- Geographic location
- Product niche (AI, Fintech, DevTools, etc.)
- Technical background
- Minimum score thresholds

### 📊 Automated Reporting
- Weekly Top 10 Founders reports
- Multiple formats: Markdown, HTML, JSON
- Scheduled cron jobs
- Email-ready templates

## Project Structure

```
founder-radar/
├── config/
│   └── default.json          # Configuration file
├── scripts/
│   └── generate-weekly-report.ts
├── src/
│   ├── api/
│   │   └── routes.ts         # API endpoints
│   ├── db/
│   │   ├── database.ts       # Database connection
│   │   ├── migrate.ts        # Migration runner
│   │   └── schema.sql        # Database schema
│   ├── models/
│   │   ├── Config.ts         # Configuration interfaces
│   │   └── Founder.ts        # Data models
│   ├── scrapers/
│   │   ├── BaseScraper.ts
│   │   ├── ProductHuntScraper.ts
│   │   ├── HackerNewsScraper.ts
│   │   ├── GitHubTrendingScraper.ts
│   │   ├── PerplexityUniversityScraper.ts
│   │   ├── ManualInputScraper.ts
│   │   └── index.ts          # Scraper orchestrator
│   ├── services/
│   │   ├── AIEnrichmentService.ts
│   │   ├── FilterService.ts
│   │   ├── FounderService.ts
│   │   ├── ReportGenerator.ts
│   │   └── ScoringService.ts
│   ├── utils/
│   │   └── config.ts         # Config manager
│   └── index.ts              # Main server
├── weekly_reports/           # Generated reports
├── .env.example
├── package.json
└── tsconfig.json
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Anthropic API key
- (Optional) Perplexity API key

### Setup Steps

1. **Clone the repository**
   ```bash
   cd founder-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/founder_radar
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   PORT=3000
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb founder_radar
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Build the project**
   ```bash
   npm run build
   ```

7. **Start the server**
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## Configuration

Edit `config/default.json` to customize:

### Source Selection
```json
{
  "sources": {
    "producthunt": true,
    "hackernews": true,
    "github_trending": true,
    "angellist": false,
    "yc_directory": true,
    "perplexity_universities": true,
    "manual_input": true
  }
}
```

### Filters
```json
{
  "filters": {
    "university": ["Waterloo", "Queen's", "Stanford", "MIT"],
    "age_range": [18, 35],
    "location": ["Toronto", "SF Bay Area", "NYC"],
    "product_niche": ["AI infra", "Fintech", "DevTools"],
    "technical_background": ["CS", "Engineering"],
    "min_execution_score": 10,
    "min_technical_score": 10,
    "exclude_non_technical": true
  }
}
```

### Scoring Weights
```json
{
  "weights": {
    "execution_velocity": 0.25,
    "technical_depth": 0.25,
    "momentum_score": 0.20,
    "market_potential": 0.20,
    "credibility": 0.10
  }
}
```

## API Endpoints

### Configuration

- **GET /api/config** - Get current configuration
- **POST /api/config/update** - Update full configuration
- **POST /api/config/sources** - Update source toggles
- **POST /api/config/filters** - Update filter settings
- **POST /api/config/weights** - Update scoring weights

### Founders

- **POST /api/founders/fetch** - Fetch founders from all enabled sources
- **POST /api/founders/manual** - Add a founder manually
- **POST /api/founders/enrich-all** - Enrich all unenriched founders
- **POST /api/founders/:id/enrich** - Enrich a specific founder
- **GET /api/founders** - Get all founders with scores
- **GET /api/founders/:id** - Get a specific founder
- **GET /api/founders/filter** - Get filtered founders
- **GET /api/founders/top10** - Get top 10 founders

### Health

- **GET /api/health** - Health check

## Usage Examples

### 1. Fetch Founders from Sources

```bash
curl -X POST http://localhost:3000/api/founders/fetch
```

### 2. Enrich All Founders

```bash
curl -X POST http://localhost:3000/api/founders/enrich-all
```

### 3. Get Top 10 Founders

```bash
curl http://localhost:3000/api/founders/top10
```

### 4. Add Manual Founder

```bash
curl -X POST http://localhost:3000/api/founders/manual \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "url": "https://linkedin.com/in/janedoe",
    "startup_name": "AI Startup",
    "description": "Building AI infrastructure"
  }'
```

### 5. Update Filters

```bash
curl -X POST http://localhost:3000/api/config/filters \
  -H "Content-Type: application/json" \
  -d '{
    "university": ["Stanford", "MIT"],
    "min_execution_score": 15
  }'
```

### 6. Generate Weekly Report

```bash
npm run weekly-report
```

Reports are saved to `weekly_reports/`:
- `top10-YYYY-MM-DD.md` (Markdown)
- `top10-YYYY-MM-DD.html` (HTML)
- `top10-YYYY-MM-DD.json` (JSON)

## Database Schema

### Founders Table
- `founder_id` (PK)
- `name`
- `startup_name`
- `age`
- `location`
- `university`
- `niche`
- `sources` (JSONB)
- `urls` (JSONB)
- `raw_data` (JSONB)
- `ai_bio`, `ai_execution_evidence`, `ai_technical_summary`, etc.
- `created_at`, `updated_at`

### Scores Table
- `score_id` (PK)
- `founder_id` (FK)
- `execution_velocity` (0-25)
- `technical_depth` (0-25)
- `momentum_score` (0-20)
- `market_potential` (0-20)
- `credibility` (0-10)
- `total_score` (0-100)
- `score_explanation`
- `created_at`, `updated_at`

## Cron Jobs

The system automatically runs weekly reports based on the `WEEKLY_REPORT_CRON` environment variable.

Default: `0 9 * * 1` (Every Monday at 9 AM)

To customize, edit `.env`:
```env
WEEKLY_REPORT_CRON=0 9 * * 1
```

## Development

### Run in Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Run Database Migrations
```bash
npm run migrate
```

## Deployment

### Local/Server Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations
4. Build and start the server

### Docker Deployment (Future)

A Dockerfile will be provided for containerized deployment.

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check database exists: `psql -l`

### API Key Issues
- Verify Anthropic API key is valid
- Check API key has sufficient credits
- Ensure environment variables are loaded

### Scraper Failures
- Some sources may be rate-limited
- GitHub API benefits from authentication (add token)
- Perplexity API requires paid plan

## Contributing

This is a production-ready system designed for VC firms. Contributions welcome for:
- New data sources
- Enhanced AI prompts
- Additional filtering criteria
- UI dashboard

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ for VCs discovering the next generation of founders.
