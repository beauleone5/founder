from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc
from sqlalchemy.orm import joinedload
from typing import List
from datetime import datetime, timedelta
from app.db.base import get_db
from app.models.user import User
from app.models.company import Company
from app.models.user_selection import UserSelection
from app.models.daily_insight import DailyInsight
from app.utils.schemas import DashboardResponse, CompanyDashboardCard, CompanyResponse, DailyInsightResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the personalized dashboard for the logged-in user."""
    # Get user's selected companies
    result = await db.execute(
        select(UserSelection)
        .where(UserSelection.user_id == current_user.id)
        .options(joinedload(UserSelection.company))
    )
    selections = result.scalars().all()

    if not selections:
        return DashboardResponse(companies=[], top_alerts=[])

    company_ids = [s.company_id for s in selections]

    # Get latest insights for each selected company
    companies_data = []
    top_alerts = []

    for selection in selections:
        company = selection.company

        # Get the most recent insight for this company
        insight_result = await db.execute(
            select(DailyInsight)
            .where(DailyInsight.company_id == company.id)
            .order_by(desc(DailyInsight.date))
            .limit(1)
        )
        latest_insight = insight_result.scalar_one_or_none()

        companies_data.append(
            CompanyDashboardCard(
                company=CompanyResponse.model_validate(company),
                latest_insight=DailyInsightResponse.model_validate(latest_insight) if latest_insight else None
            )
        )

        # Collect top alerts (must_know items from insights)
        if latest_insight and latest_insight.must_know:
            # Check if insight is from today
            if latest_insight.date.date() == datetime.utcnow().date():
                top_alerts.append(f"{company.name}: {latest_insight.must_know}")

    # Sort alerts by risk score (highest first)
    companies_data.sort(
        key=lambda x: x.latest_insight.risk_score if x.latest_insight and x.latest_insight.risk_score else 0,
        reverse=True
    )

    # Limit top alerts to 5
    top_alerts = top_alerts[:5]

    return DashboardResponse(
        companies=companies_data,
        top_alerts=top_alerts
    )


@router.get("/company/{company_id}/insights", response_model=List[DailyInsightResponse])
async def get_company_insights(
    company_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all insights for a specific company (for deep dive page)."""
    # Verify user has selected this company
    result = await db.execute(
        select(UserSelection).where(
            and_(
                UserSelection.user_id == current_user.id,
                UserSelection.company_id == company_id
            )
        )
    )
    selection = result.scalar_one_or_none()

    if not selection:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must select this company first"
        )

    # Get all insights for this company (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    insights_result = await db.execute(
        select(DailyInsight)
        .where(
            and_(
                DailyInsight.company_id == company_id,
                DailyInsight.date >= thirty_days_ago
            )
        )
        .order_by(desc(DailyInsight.date))
    )
    insights = insights_result.scalars().all()

    return insights
