Database set up:
    docker run --name job-tracker-db -e POSTGRES_PASSWORD=jobtracker -e POSTGRES_DB=job_tracker -p 5444:5432 -d postgres

Run backend in venv:
    uvicorn main:app --reload

Run frontend:
    npm run dev