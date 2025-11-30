from sqlalchemy import Column, Integer, ForeignKey, String, Text, Float, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class DailyInsight(Base):
    __tablename__ = "daily_insights"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # AI-generated insights
    daily_summary = Column(Text, nullable=True)
    top_insights = Column(JSON, nullable=True)  # List of insights
    risk_score = Column(Float, nullable=True)  # 0-100
    opportunity_score = Column(Float, nullable=True)  # 0-100
    must_know = Column(Text, nullable=True)  # What the VC must know today

    # Raw data sources
    news_data = Column(JSON, nullable=True)
    github_data = Column(JSON, nullable=True)
    competitor_data = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    company = relationship("Company", back_populates="insights")
