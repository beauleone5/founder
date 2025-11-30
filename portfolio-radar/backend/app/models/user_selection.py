from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class UserSelection(Base):
    __tablename__ = "user_selections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="selections")
    company = relationship("Company", back_populates="selections")
