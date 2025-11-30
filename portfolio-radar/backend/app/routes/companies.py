from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.db.base import get_db
from app.models.company import Company
from app.models.user import User
from app.utils.schemas import CompanyResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.get("", response_model=List[CompanyResponse])
async def get_companies(
    search: Optional[str] = Query(None, description="Search companies by name"),
    sector: Optional[str] = Query(None, description="Filter by sector"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all companies with optional search and filtering."""
    query = select(Company)

    # Apply search filter
    if search:
        query = query.where(Company.name.ilike(f"%{search}%"))

    # Apply sector filter
    if sector:
        query = query.where(Company.sector == sector)

    result = await db.execute(query.order_by(Company.name))
    companies = result.scalars().all()

    return companies


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific company by ID."""
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()

    if not company:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )

    return company
