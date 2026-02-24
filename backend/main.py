from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

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

@app.patch("/jobs/{job_id}", response_model=schemas.Job)
def update_job(job_id: int, job_update: schemas.JobUpdate, db: Session = Depends(get_db)):
    db_job = db.query(models.JobApplication).filter(models.JobApplication.id == job_id).first()

    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = job_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_job, key, value)

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    return db_job

@app.get('/')
def read_root():
    return {"message": "Job Application Tracker API is running!"}

@app.get('/health')
def health_check():
    return {"status": "ok"}