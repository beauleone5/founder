import { Router, Request, Response } from 'express';
import { configManager } from '../utils/config';
import { scraperOrchestrator } from '../scrapers';
import { founderService } from '../services/FounderService';
import { filterService } from '../services/FilterService';
import { scoringService } from '../services/ScoringService';

const router = Router();

router.get('/config', (req: Request, res: Response) => {
  try {
    const config = configManager.getConfig();
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/config/update', (req: Request, res: Response) => {
  try {
    const updates = req.body;
    configManager.updateConfig(updates);
    res.json({ success: true, config: configManager.getConfig() });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/config/sources', (req: Request, res: Response) => {
  try {
    const sources = req.body;
    configManager.updateSources(sources);
    res.json({ success: true, sources: configManager.getSources() });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/config/filters', (req: Request, res: Response) => {
  try {
    const filters = req.body;
    configManager.updateFilters(filters);
    filterService.updateFilters(filters);
    res.json({ success: true, filters: configManager.getFilters() });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/config/weights', (req: Request, res: Response) => {
  try {
    const weights = req.body;
    scoringService.updateWeights(weights);
    res.json({ success: true, weights: scoringService.getWeights() });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/founders/fetch', async (req: Request, res: Response) => {
  try {
    console.log('Starting founder fetch from all sources...');
    const founders = await scraperOrchestrator.fetchAll();

    const savedFounders = [];
    for (const founder of founders) {
      try {
        const saved = await founderService.createFounder(founder);
        savedFounders.push(saved);
      } catch (error) {
        console.error('Error saving founder:', error);
      }
    }

    res.json({
      success: true,
      count: savedFounders.length,
      founders: savedFounders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/founders/manual', async (req: Request, res: Response) => {
  try {
    const { name, url, startup_name, description } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        error: 'Name and URL are required',
      });
    }

    const manualScraper = scraperOrchestrator.getManualInputScraper();
    const founder = await manualScraper.addManualFounder({
      name,
      url,
      startup_name,
      description,
    });

    const saved = await founderService.createFounder(founder);

    res.json({
      success: true,
      founder: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/founders/:id/enrich', async (req: Request, res: Response) => {
  try {
    const founderId = parseInt(req.params.id);

    if (isNaN(founderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid founder ID',
      });
    }

    await founderService.enrichAndScoreFounder(founderId);
    const founder = await founderService.getFounderWithScore(founderId);

    res.json({
      success: true,
      founder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/founders/enrich-all', async (req: Request, res: Response) => {
  try {
    const founders = await founderService.getAllFoundersWithScores();
    const unenrichedFounders = founders.filter((f) => !f.score);

    console.log(`Enriching ${unenrichedFounders.length} founders...`);

    for (const founder of unenrichedFounders) {
      try {
        await founderService.enrichAndScoreFounder(founder.founder_id!);
      } catch (error) {
        console.error(`Error enriching founder ${founder.founder_id}:`, error);
      }
    }

    res.json({
      success: true,
      enriched: unenrichedFounders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/founders', async (req: Request, res: Response) => {
  try {
    const founders = await founderService.getAllFoundersWithScores();
    res.json({
      success: true,
      count: founders.length,
      founders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/founders/:id', async (req: Request, res: Response) => {
  try {
    const founderId = parseInt(req.params.id);

    if (isNaN(founderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid founder ID',
      });
    }

    const founder = await founderService.getFounderWithScore(founderId);

    if (!founder) {
      return res.status(404).json({
        success: false,
        error: 'Founder not found',
      });
    }

    res.json({
      success: true,
      founder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/founders/filter', async (req: Request, res: Response) => {
  try {
    const founders = await founderService.getAllFoundersWithScores();
    const filtered = filterService.applyFilters(founders);

    res.json({
      success: true,
      count: filtered.length,
      founders: filtered,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/founders/top10', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const topFounders = await founderService.getTopFounders(limit);

    res.json({
      success: true,
      count: topFounders.length,
      founders: topFounders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
