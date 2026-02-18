from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/jobs", response_model=schemas.Job)
def create_job(job_data: schemas.JobCreate, db: Session = Depends(get_db)):
    new_job = models.JobApplication(
        company=job_data.company,
        position=job_data.position,
        status=job_data.status,
        salary=job_data.salary
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@app.get('/jobs', response_model=list[schemas.Job])
def read_jobs(db: Session = Depends(get_db)):
    return db.query(models.JobApplication).all()

origins = [
    "http://localhost:3000",
    "http://localhost:5173"
]

@app.get('/')
def read_root():
    return {"message": "Job Application Tracker API is running!"}

@app.get('/health')
def health_check():
    return {"status": "ok"}