from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.intelligence_pipeline import run_daily_pipeline
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def start_scheduler():
    """
    Start the scheduler for daily intelligence pipeline.
    Runs every day at 6:00 AM UTC.
    """
    # Add job to run daily at 6:00 AM UTC
    scheduler.add_job(
        run_daily_pipeline,
        trigger=CronTrigger(hour=6, minute=0),
        id="daily_intelligence_pipeline",
        name="Daily Intelligence Pipeline",
        replace_existing=True
    )

    scheduler.start()
    logger.info("Scheduler started. Daily pipeline will run at 6:00 AM UTC")


def stop_scheduler():
    """Stop the scheduler."""
    scheduler.shutdown()
    logger.info("Scheduler stopped")


def run_pipeline_now():
    """
    Manually trigger the pipeline (useful for testing).
    """
    scheduler.add_job(
        run_daily_pipeline,
        id="manual_pipeline_run",
        replace_existing=True
    )
    logger.info("Manual pipeline run triggered")
