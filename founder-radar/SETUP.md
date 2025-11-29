# Setup Guide for Founder Radar

This guide will walk you through setting up Founder Radar from scratch.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **PostgreSQL** (v12 or higher)
   ```bash
   psql --version  # Should be 12.0 or higher
   ```

3. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

### Required API Keys

1. **Anthropic API Key** (Required)
   - Sign up at https://console.anthropic.com/
   - Create an API key
   - Ensure you have credits available

2. **Perplexity API Key** (Optional, but recommended for university pipeline)
   - Sign up at https://www.perplexity.ai/
   - Subscribe to a paid plan
   - Generate an API key

## Installation Steps

### 1. Install Dependencies

```bash
cd founder-radar
npm install
```

This will install all required packages including:
- Express (API server)
- PostgreSQL driver
- Anthropic SDK
- TypeScript
- And more...

### 2. Set Up PostgreSQL Database

#### On macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create a database user
createuser -s founder_radar_user

# Create the database
createdb founder_radar
```

#### On Ubuntu/Debian
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql
CREATE USER founder_radar_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE founder_radar OWNER founder_radar_user;
\q
```

#### On Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Use pgAdmin to create:
   - User: `founder_radar_user`
   - Database: `founder_radar`

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

Update the following values:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=founder_radar
DB_USER=founder_radar_user
DB_PASSWORD=your_secure_password

# API Keys (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx

# API Keys (OPTIONAL)
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=3000
NODE_ENV=development

# Cron Schedule (Monday at 9 AM)
WEEKLY_REPORT_CRON=0 9 * * 1
```

### 4. Run Database Migrations

```bash
npm run migrate
```

This will create the necessary tables:
- `founders`
- `scores`
- Indexes and triggers

### 5. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 6. Start the Server

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║           🚀 Founder Radar API Server 🚀             ║
║  Status: Running                                      ║
║  Port: 3000                                           ║
╚═══════════════════════════════════════════════════════╝
```

### 7. Verify Installation

Open a new terminal and test the API:

```bash
# Health check
curl http://localhost:3000/api/health

# Should return:
# {"success":true,"status":"healthy","timestamp":"..."}
```

## First-Time Usage

### 1. Fetch Founders from Sources

```bash
curl -X POST http://localhost:3000/api/founders/fetch
```

This will:
- Fetch from ProductHunt, HackerNews, GitHub, etc.
- Save founders to the database
- Return the count of founders found

### 2. Enrich Founders with AI

```bash
curl -X POST http://localhost:3000/api/founders/enrich-all
```

This will:
- Process each founder through Claude AI
- Generate bios, technical summaries, scores
- Update the database with enrichment data

**Note:** This may take 5-10 minutes for 50 founders.

### 3. View Top Founders

```bash
curl http://localhost:3000/api/founders/top10
```

### 4. Generate Weekly Report

```bash
npm run weekly-report
```

Check `weekly_reports/` folder for:
- Markdown report
- HTML report
- JSON data

## Configuration

### Customize Sources

Edit `config/default.json`:

```json
{
  "sources": {
    "producthunt": true,
    "hackernews": true,
    "github_trending": false,  // Disable GitHub
    "perplexity_universities": true
  }
}
```

Or use the API:

```bash
curl -X POST http://localhost:3000/api/config/sources \
  -H "Content-Type: application/json" \
  -d '{"github_trending": false}'
```

### Customize Filters

```bash
curl -X POST http://localhost:3000/api/config/filters \
  -H "Content-Type: application/json" \
  -d '{
    "university": ["Stanford", "MIT", "Waterloo"],
    "product_niche": ["AI infra", "DevTools"],
    "min_execution_score": 15
  }'
```

### Customize Scoring Weights

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

Note: Weights must sum to 1.0 (100%).

## Scheduling

The system uses `node-cron` to run weekly reports automatically.

### Default Schedule
- Every Monday at 9:00 AM

### Custom Schedule

Edit `.env`:
```env
# Every day at 10 AM
WEEKLY_REPORT_CRON=0 10 * * *

# Every Friday at 5 PM
WEEKLY_REPORT_CRON=0 17 * * 5

# Every hour
WEEKLY_REPORT_CRON=0 * * * *
```

Cron format: `minute hour day month weekday`

## Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start the app
pm2 start dist/index.js --name founder-radar

# Enable auto-restart on system reboot
pm2 startup
pm2 save

# View logs
pm2 logs founder-radar

# Monitor
pm2 monit
```

### Using systemd (Linux)

Create `/etc/systemd/system/founder-radar.service`:

```ini
[Unit]
Description=Founder Radar API
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/founder-radar
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable founder-radar
sudo systemctl start founder-radar
sudo systemctl status founder-radar
```

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   # or on macOS:
   brew services list
   ```

2. Verify credentials in `.env`

3. Test connection manually:
   ```bash
   psql -h localhost -U founder_radar_user -d founder_radar
   ```

### Issue: "ANTHROPIC_API_KEY not found"

**Solution:**
1. Ensure `.env` file exists in the project root
2. Verify the API key is correct
3. Restart the server after editing `.env`

### Issue: "Migration failed"

**Solution:**
1. Drop and recreate the database:
   ```bash
   dropdb founder_radar
   createdb founder_radar
   npm run migrate
   ```

### Issue: "Scraper not returning results"

**Solutions:**
- **ProductHunt:** May require rate limiting (add delays)
- **HackerNews:** Check API is accessible
- **GitHub:** Add `GITHUB_TOKEN` to `.env` for higher rate limits
- **Perplexity:** Requires paid API key

### Issue: "Enrichment taking too long"

**Solution:**
- Process founders in batches
- Consider upgrading Anthropic API tier
- Run enrichment during off-peak hours

## Next Steps

1. **Explore the API** - Use the endpoints to manage founders
2. **Customize prompts** - Edit AI prompts in `AIEnrichmentService.ts`
3. **Add more sources** - Create new scrapers in `src/scrapers/`
4. **Build a dashboard** - Create a UI using React/Vue
5. **Set up monitoring** - Use tools like Datadog or New Relic

## Support

For issues or questions:
- Check the logs: `pm2 logs` or console output
- Review the API documentation
- Open an issue on GitHub

---

You're now ready to discover the next generation of founders! 🚀
