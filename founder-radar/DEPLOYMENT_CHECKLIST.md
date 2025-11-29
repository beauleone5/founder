# Deployment Checklist for Founder Radar

Use this checklist to ensure proper deployment of Founder Radar.

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 12+ installed and running
- [ ] Anthropic API key obtained
- [ ] (Optional) Perplexity API key obtained

### 2. Project Setup
- [ ] Dependencies installed (`npm install`)
- [ ] TypeScript compiled (`npm run build`)
- [ ] .env file created and configured
- [ ] Database created (`createdb founder_radar`)
- [ ] Migrations run (`npm run migrate`)

### 3. Configuration
- [ ] API keys added to .env
  - [ ] ANTHROPIC_API_KEY
  - [ ] PERPLEXITY_API_KEY (optional)
- [ ] Database credentials in .env
  - [ ] DB_HOST
  - [ ] DB_PORT
  - [ ] DB_NAME
  - [ ] DB_USER
  - [ ] DB_PASSWORD
- [ ] Port configured (default: 3000)
- [ ] Cron schedule configured (default: Monday 9 AM)

### 4. Source Configuration (config/default.json)
- [ ] Enable/disable desired sources
  - [ ] producthunt
  - [ ] hackernews
  - [ ] github_trending
  - [ ] perplexity_universities
- [ ] Configure filters
  - [ ] university list
  - [ ] location list
  - [ ] product_niche list
  - [ ] score thresholds
- [ ] Set scoring weights (must sum to 1.0)

### 5. Verification
- [ ] Run verification script: `./scripts/verify-setup.sh`
- [ ] Test health endpoint: `curl http://localhost:3000/api/health`
- [ ] Build completes without errors
- [ ] Server starts successfully

## 🚀 Deployment Steps

### Development Deployment

```bash
# 1. Clone/navigate to project
cd founder-radar

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Setup database
createdb founder_radar
npm run migrate

# 5. Build project
npm run build

# 6. Start server
npm run dev
```

### Production Deployment (PM2)

```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Build project
npm run build

# 3. Start with PM2
pm2 start dist/index.js --name founder-radar

# 4. Configure auto-restart
pm2 startup
pm2 save

# 5. Monitor
pm2 logs founder-radar
pm2 monit
```

### Production Deployment (systemd)

```bash
# 1. Create service file
sudo nano /etc/systemd/system/founder-radar.service

# 2. Add service configuration (see SETUP.md)

# 3. Enable and start service
sudo systemctl enable founder-radar
sudo systemctl start founder-radar

# 4. Check status
sudo systemctl status founder-radar
```

### Docker Deployment (Future)

```bash
# Coming soon
docker-compose up -d
```

## 🧪 Testing Checklist

### Smoke Tests

```bash
# 1. Health check
curl http://localhost:3000/api/health
# Expected: {"success":true,"status":"healthy"}

# 2. Get config
curl http://localhost:3000/api/config
# Expected: JSON config object

# 3. Fetch founders (if sources are configured)
curl -X POST http://localhost:3000/api/founders/fetch
# Expected: {"success":true,"count":N,"founders":[...]}
```

### Integration Tests

```bash
# 1. Add manual founder
curl -X POST http://localhost:3000/api/founders/manual \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Founder","url":"https://example.com","startup_name":"Test Co"}'

# 2. Enrich founder (requires ANTHROPIC_API_KEY)
curl -X POST http://localhost:3000/api/founders/1/enrich

# 3. Get top founders
curl http://localhost:3000/api/founders/top10

# 4. Generate report
npm run weekly-report
```

## 📊 Monitoring Checklist

### Logs
- [ ] Application logs configured
- [ ] Error tracking setup
- [ ] Database query logs enabled (if needed)

### Performance
- [ ] Database indexes created (automatic via migrations)
- [ ] Connection pooling configured (default: max 20)
- [ ] API rate limiting considered

### Security
- [ ] Environment variables secured (not in version control)
- [ ] Database credentials secured
- [ ] API keys secured
- [ ] (Production) API authentication implemented
- [ ] (Production) HTTPS enabled
- [ ] (Production) CORS configured properly

### Backups
- [ ] Database backup strategy in place
- [ ] Config file backups
- [ ] Weekly reports archived

## 🔧 Maintenance Checklist

### Daily
- [ ] Check server health: `curl http://localhost:3000/api/health`
- [ ] Monitor logs: `pm2 logs` or `systemctl status founder-radar`

### Weekly
- [ ] Review generated reports in `weekly_reports/`
- [ ] Check database size and performance
- [ ] Review founder counts and data quality

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review API usage and costs (Anthropic, Perplexity)
- [ ] Backup database
- [ ] Review and update filters/weights based on results

### Quarterly
- [ ] Review and optimize scoring algorithm
- [ ] Add new data sources if needed
- [ ] Update documentation
- [ ] Security audit

## 🐛 Troubleshooting

### Common Issues

**Issue: Server won't start**
- Check: PostgreSQL is running
- Check: Port 3000 is available
- Check: .env file exists and is valid
- Run: `npm run build` to check for TypeScript errors

**Issue: Database connection failed**
- Check: PostgreSQL is running: `sudo systemctl status postgresql`
- Check: Database exists: `psql -l | grep founder_radar`
- Check: Credentials in .env are correct
- Test: `psql -h localhost -U [user] -d founder_radar`

**Issue: API key error**
- Check: ANTHROPIC_API_KEY is set in .env
- Check: API key is valid (not expired)
- Check: API key has credits available

**Issue: Scraper not returning data**
- Check: Source is enabled in config/default.json
- Check: Network connectivity
- Check: API rate limits (GitHub, etc.)
- Review: Logs for specific error messages

**Issue: Enrichment taking too long**
- Normal: 5-10 minutes for 50 founders
- Consider: Processing in smaller batches
- Check: Anthropic API tier and rate limits

## 📈 Success Metrics

After deployment, monitor:

- [ ] Founders fetched per week
- [ ] Enrichment success rate
- [ ] Top 10 report generation success
- [ ] API response times
- [ ] Database query performance
- [ ] Weekly active sources
- [ ] Filter effectiveness (founders matched vs total)

## 🎯 Post-Deployment Tasks

- [ ] Schedule weekly report delivery (email/Slack)
- [ ] Set up monitoring/alerting
- [ ] Create internal documentation for team
- [ ] Train team on using API endpoints
- [ ] Establish data review process
- [ ] Plan for scaling (if needed)

## ✅ Deployment Complete!

Once all checklists are complete:

1. **Server Status**: ✅ Running
2. **Database**: ✅ Connected and migrated
3. **API**: ✅ Responding to requests
4. **Cron**: ✅ Scheduled for weekly reports
5. **Documentation**: ✅ Team trained
6. **Monitoring**: ✅ In place

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: 1.0.0
**Environment**: _______________

🎉 Founder Radar is now live and discovering founders!
