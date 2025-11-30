import asyncio
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.company import Company
from app.models.user_selection import UserSelection
from app.models.daily_insight import DailyInsight
from app.services.news_service import fetch_company_news
from app.services.github_service import fetch_github_activity
from app.services.openai_service import generate_company_insights
from app.db.base import async_session_maker


async def generate_insights_for_company(company: Company, db: AsyncSession) -> DailyInsight:
    """
    Generate daily insights for a single company.

    Steps:
    1. Fetch news data
    2. Fetch GitHub activity
    3. Fetch competitor mentions (simplified)
    4. Send to OpenAI for analysis
    5. Store results in database
    """
    print(f"Generating insights for {company.name}...")

    # Fetch data from various sources
    news_data = await fetch_company_news(company.name, company.website)
    github_data = await fetch_github_activity(company.name)

    # Fetch competitor data (simplified - just fetch news for competitors)
    competitor_data = {"competitors": []}
    if company.competitor_list:
        for competitor in company.competitor_list[:3]:  # Limit to 3 competitors
            competitor_news = await fetch_company_news(competitor)
            competitor_data["competitors"].append({
                "name": competitor,
                "recent_news": competitor_news.get("articles", [])[:2]
            })

    # Generate AI insights
    ai_insights = await generate_company_insights(
        company_name=company.name,
        news_data=news_data,
        github_data=github_data,
        competitor_data=competitor_data
    )

    # Create daily insight record
    insight = DailyInsight(
        company_id=company.id,
        date=datetime.utcnow(),
        daily_summary=ai_insights.get("daily_summary"),
        top_insights=ai_insights.get("top_insights"),
        risk_score=ai_insights.get("risk_score"),
        opportunity_score=ai_insights.get("opportunity_score"),
        must_know=ai_insights.get("must_know"),
        news_data=news_data,
        github_data=github_data,
        competitor_data=competitor_data
    )

    db.add(insight)
    await db.commit()
    await db.refresh(insight)

    print(f"✓ Generated insights for {company.name}")
    return insight


async def run_daily_pipeline():
    """
    Run the daily intelligence pipeline for all selected companies.

    This should be run daily via cron job.
    """
    print("=" * 50)
    print("Starting Daily Intelligence Pipeline")
    print(f"Time: {datetime.utcnow().isoformat()}")
    print("=" * 50)

    async with async_session_maker() as db:
        # Get all companies that have been selected by at least one user
        result = await db.execute(
            select(Company)
            .join(UserSelection)
            .distinct()
        )
        companies = result.scalars().all()

        if not companies:
            print("No companies selected by users. Exiting.")
            return

        print(f"Found {len(companies)} companies to process")

        # Process each company
        for company in companies:
            try:
                await generate_insights_for_company(company, db)
                # Add a small delay to avoid rate limiting
                await asyncio.sleep(1)
            except Exception as e:
                print(f"Error processing {company.name}: {e}")
                continue

    print("=" * 50)
    print("Daily Intelligence Pipeline Completed")
    print("=" * 50)


async def test_pipeline_for_company(company_id: int):
    """
    Test the pipeline for a specific company (useful for debugging).
    """
    async with async_session_maker() as db:
        result = await db.execute(select(Company).where(Company.id == company_id))
        company = result.scalar_one_or_none()

        if not company:
            print(f"Company with ID {company_id} not found")
            return

        insight = await generate_insights_for_company(company, db)
        print(f"\nGenerated Insight:")
        print(f"Summary: {insight.daily_summary}")
        print(f"Risk Score: {insight.risk_score}")
        print(f"Opportunity Score: {insight.opportunity_score}")
        print(f"Must Know: {insight.must_know}")
