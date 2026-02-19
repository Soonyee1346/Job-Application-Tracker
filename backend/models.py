import enum
from database import Base
from sqlalchemy.sql import func
from sqlalchemy import Column, Integer, String, DateTime, Enum

class JobStatus(enum.Enum):
    WISHLIST = "Wishlist"
    APPLIED = "Applied"
    INTERVIEWING = "Interviewing"
    OFFER = "Offer"
    REJECTED = "Rejected"
    ACCEPTED = "Accepted"
    DECLINED = "Declined"

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.APPLIED)
    salary = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())