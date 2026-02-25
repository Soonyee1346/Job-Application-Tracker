from pydantic import BaseModel, ConfigDict
from models import JobStatus
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    company: str
    position: str
    status: JobStatus = JobStatus.APPLIED
    salary: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    status: Optional[JobStatus] = None
    salary: Optional[str] = None

class Job(JobBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)