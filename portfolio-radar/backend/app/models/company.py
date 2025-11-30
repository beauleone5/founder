from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    sector = Column(String, nullable=False)
    website = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    competitor_list = Column(JSON, nullable=True)  # List of competitor names

    # Relationships
    selections = relationship("UserSelection", back_populates="company", cascade="all, delete-orphan")
    insights = relationship("DailyInsight", back_populates="company", cascade="all, delete-orphan")
