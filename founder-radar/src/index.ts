import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import routes from './api/routes';
import db from './db/database';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();

const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    name: 'Founder Radar API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      config: '/api/config',
      founders: '/api/founders',
      top10: '/api/founders/top10',
    },
  });
});

async function startServer() {
  try {
    const connected = await db.testConnection();
    if (!connected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }

    const cronSchedule = process.env.WEEKLY_REPORT_CRON || '0 9 * * 1';
    cron.schedule(cronSchedule, async () => {
      console.log('Running weekly report generation...');
      try {
        await execAsync('npm run weekly-report');
        console.log('✓ Weekly report generated successfully');
      } catch (error) {
        console.error('Error generating weekly report:', error);
      }
    });

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           🚀 Founder Radar API Server 🚀             ║
║                                                       ║
║  Status: Running                                      ║
║  Port: ${PORT}                                        ║
║  Environment: ${process.env.NODE_ENV || 'development'}                            ║
║                                                       ║
║  API Endpoints:                                       ║
║  - GET  /api/health                                   ║
║  - GET  /api/config                                   ║
║  - POST /api/config/update                            ║
║  - POST /api/founders/fetch                           ║
║  - POST /api/founders/manual                          ║
║  - GET  /api/founders                                 ║
║  - GET  /api/founders/top10                           ║
║  - GET  /api/founders/filter                          ║
║                                                       ║
║  Cron Schedule: ${cronSchedule}                           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await db.close();
  process.exit(0);
});
