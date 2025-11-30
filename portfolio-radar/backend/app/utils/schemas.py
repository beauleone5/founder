from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# Company Schemas
class CompanyBase(BaseModel):
    name: str
    sector: str
    website: Optional[str] = None
    logo: Optional[str] = None
    description: Optional[str] = None
    competitor_list: Optional[List[str]] = None


class CompanyResponse(CompanyBase):
    id: int

    class Config:
        from_attributes = True


# Selection Schemas
class SelectionCreate(BaseModel):
    company_ids: List[int]


class SelectionResponse(BaseModel):
    id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Insight Schemas
class DailyInsightResponse(BaseModel):
    id: int
    company_id: int
    date: datetime
    daily_summary: Optional[str] = None
    top_insights: Optional[List[str]] = None
    risk_score: Optional[float] = None
    opportunity_score: Optional[float] = None
    must_know: Optional[str] = None
    news_data: Optional[dict] = None
    github_data: Optional[dict] = None
    competitor_data: Optional[dict] = None

    class Config:
        from_attributes = True


# Dashboard Schemas
class CompanyDashboardCard(BaseModel):
    company: CompanyResponse
    latest_insight: Optional[DailyInsightResponse] = None


class DashboardResponse(BaseModel):
    companies: List[CompanyDashboardCard]
    top_alerts: List[str]
