# Quick Start Guide

Get Founder Radar running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Anthropic API key

## Installation

```bash
# 1. Navigate to the project
cd founder-radar

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your credentials
# Required: DATABASE_URL, ANTHROPIC_API_KEY
# Optional: PERPLEXITY_API_KEY
nano .env

# 5. Create PostgreSQL database
createdb founder_radar

# 6. Run migrations
npm run migrate

# 7. Build the project
npm run build

# 8. Start the server
npm start
```

## Verify Installation

```bash
# Test the API
curl http://localhost:3000/api/health

# Should return: {"success":true,"status":"healthy"}
```

## First Steps

### 1. Fetch Founders

```bash
curl -X POST http://localhost:3000/api/founders/fetch
```

This fetches founders from ProductHunt, HackerNews, GitHub, etc.

### 2. Enrich with AI

```bash
curl -X POST http://localhost:3000/api/founders/enrich-all
```

This uses Claude AI to analyze and score each founder. Takes 5-10 minutes for 50 founders.

### 3. View Top 10

```bash
curl http://localhost:3000/api/founders/top10
```

### 4. Generate Report

```bash
npm run weekly-report
```

Check `weekly_reports/` for Markdown, HTML, and JSON files.

## Customize

### Change Filters

```bash
curl -X POST http://localhost:3000/api/config/filters \
  -H "Content-Type: application/json" \
  -d '{
    "university": ["Stanford", "MIT"],
    "min_execution_score": 15
  }'
```

### Adjust Scoring Weights

```bash
curl -X POST http://localhost:3000/api/config/weights \
  -H "Content-Type: application/json" \
  -d '{
    "execution_velocity": 0.30,
    "technical_depth": 0.30,
    "momentum_score": 0.20,
    "market_potential": 0.15,
    "credibility": 0.05
  }'
```

### Toggle Sources

```bash
curl -X POST http://localhost:3000/api/config/sources \
  -H "Content-Type: application/json" \
  -d '{
    "producthunt": true,
    "hackernews": true,
    "github_trending": false
  }'
```

## Configuration File

Edit `config/default.json` directly:

```json
{
  "sources": {
    "producthunt": true,
    "hackernews": true,
    "github_trending": true
  },
  "filters": {
    "university": ["Stanford", "MIT", "Waterloo"],
    "product_niche": ["AI infra", "DevTools"],
    "min_execution_score": 10
  },
  "weights": {
    "execution_velocity": 0.25,
    "technical_depth": 0.25,
    "momentum_score": 0.20,
    "market_potential": 0.20,
    "credibility": 0.10
  }
}
```

## Scheduled Reports

The system auto-generates weekly reports every Monday at 9 AM.

To change:
```bash
# Edit .env
WEEKLY_REPORT_CRON=0 9 * * 1
```

Format: `minute hour day month weekday`

## Troubleshooting

### Can't connect to database
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # macOS

# Test connection
psql -h localhost -U founder_radar_user -d founder_radar
```

### API key not found
```bash
# Ensure .env exists and has your key
cat .env | grep ANTHROPIC

# Restart server after editing .env
```

### Build failed
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [API.md](API.md) for API reference
- See [SETUP.md](SETUP.md) for detailed setup instructions

## Production

For production deployment, use PM2:

```bash
npm install -g pm2
pm2 start dist/index.js --name founder-radar
pm2 save
pm2 startup
```

---

Happy founder hunting! 🚀
