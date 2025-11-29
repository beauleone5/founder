# Contributing to Founder Radar

Thank you for your interest in contributing to Founder Radar!

## How to Contribute

### Adding New Data Sources

1. Create a new scraper class in `src/scrapers/`
2. Extend `BaseScraper`
3. Implement the `fetch()` method
4. Add the scraper to the orchestrator in `src/scrapers/index.ts`
5. Add the source to the config interface in `src/models/Config.ts`
6. Add the source to `config/default.json`
7. Update documentation

Example:

```typescript
// src/scrapers/TwitterScraper.ts
import { BaseScraper, ScraperResult } from './BaseScraper';

export class TwitterScraper extends BaseScraper {
  constructor() {
    super('twitter');
  }

  async fetch(): Promise<ScraperResult> {
    // Implementation
  }
}
```

### Adding New Scoring Criteria

1. Update `Score` interface in `src/models/Founder.ts`
2. Update `ScoreWeights` interface in `src/models/Config.ts`
3. Add new prompt in `AIEnrichmentService.ts`
4. Update scoring calculation in `ScoringService.ts`
5. Update default config
6. Update documentation

### Adding New Filters

1. Update `FilterConfig` in `src/models/Config.ts`
2. Add filter logic in `FilterService.ts`
3. Update default config
4. Update API documentation

### Adding New Report Formats

1. Add generation method in `ReportGenerator.ts`
2. Update `generateWeeklyReport.ts` script
3. Update documentation

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Add comments for complex logic
- Update JSDoc comments
- Run `npm run build` to check for errors

## Testing

Before submitting:

1. Build succeeds: `npm run build`
2. No TypeScript errors
3. Test locally with real data
4. Update documentation

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Update documentation
6. Submit a pull request

## Questions?

Open an issue for:
- Feature requests
- Bug reports
- Documentation improvements
- Questions about the codebase

---

Thank you for helping make Founder Radar better! 🚀
