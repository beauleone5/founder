from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from app.db.base import get_db
from app.models.user import User
from app.models.company import Company
from app.models.user_selection import UserSelection
from app.utils.schemas import SelectionCreate, SelectionResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/user/selections", tags=["selections"])


@router.post("", response_model=List[SelectionResponse], status_code=status.HTTP_201_CREATED)
async def save_selections(
    selection_data: SelectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save user's selected companies. Replaces all previous selections."""
    # Delete all existing selections for this user
    await db.execute(
        delete(UserSelection).where(UserSelection.user_id == current_user.id)
    )

    # Verify all company IDs exist
    result = await db.execute(
        select(Company).where(Company.id.in_(selection_data.company_ids))
    )
    existing_companies = result.scalars().all()
    existing_company_ids = {c.id for c in existing_companies}

    # Check if any company IDs are invalid
    invalid_ids = set(selection_data.company_ids) - existing_company_ids
    if invalid_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid company IDs: {invalid_ids}"
        )

    # Create new selections
    new_selections = []
    for company_id in selection_data.company_ids:
        selection = UserSelection(
            user_id=current_user.id,
            company_id=company_id
        )
        db.add(selection)
        new_selections.append(selection)

    await db.commit()

    # Refresh all selections to get their IDs
    for selection in new_selections:
        await db.refresh(selection)

    return new_selections


@router.get("", response_model=List[SelectionResponse])
async def get_selections(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's selected companies."""
    result = await db.execute(
        select(UserSelection).where(UserSelection.user_id == current_user.id)
    )
    selections = result.scalars().all()

    return selections
