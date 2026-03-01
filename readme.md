🚀 Job Application Tracker
A full-stack, cloud-native Kanban board application designed to track job applications through various stages (Wishlist, Applied, Interviewing, Offer, Rejected, Accepted, Declined).

Built with a modern stack featuring a React frontend, a FastAPI Python backend, and a PostgreSQL database, the entire application is containerized with Docker and provisioned on AWS using Terraform.

🛠️ Tech Stack
Frontend: React 19, Vite, TailwindCSS, @dnd-kit (Drag and Drop)

Backend: Python 3.11, FastAPI, SQLAlchemy, Alembic (Migrations)

Database: PostgreSQL

Infrastructure as Code (IaC): Terraform

Cloud (AWS): VPC, Elastic Container Service (ECS Fargate), Elastic Container Registry (ECR), Relational Database Service (RDS), IAM

✨ Features
Interactive Kanban Board: Drag and drop job cards between status columns to update their state instantly.

CRUD Operations: Add new applications, edit existing ones, or delete them.

Cloud-Native Architecture: Fully deployed on serverless AWS Fargate containers with a private, secure RDS database.

Infrastructure as Code: 100% of the AWS infrastructure is defined in Terraform for reproducibility.

💻 Local Development Setup
Prerequisites
Docker & Docker Compose

Node.js & npm (for local frontend development)

Python 3.11+ (for local backend development)

Quick Start (Docker Compose)
You can spin up the entire stack locally using Docker Compose.

Bash
docker-compose up --build
Frontend will be available at: http://localhost:5173

Backend API will be available at: http://localhost:8000

API Documentation (Swagger UI): http://localhost:8000/docs

Manual Local Setup
Database: Start a local PostgreSQL instance.

Bash
docker run --name job-tracker-db -e POSTGRES_PASSWORD=jobtracker -e POSTGRES_DB=job_tracker -p 5444:5432 -d postgres
Backend: Navigate to /backend, install requirements, run migrations, and start the server.

Bash
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
Frontend: Navigate to /frontend, install dependencies, and start Vite.

Bash
npm install
npm run dev

☁️ AWS Deployment Guide (Terraform branch)
This project uses Terraform to provision a VPC, Public/Private subnets, Security Groups, an RDS Postgres instance, and an ECS Fargate cluster.

1. Provision ECR Repositories
First, create the Elastic Container Registries to hold the Docker images.

Bash
cd terraform
terraform init
terraform apply -target=aws_ecr_repository.backend -target=aws_ecr_repository.frontend
2. Build and Push Images
Log into AWS ECR and push the backend and frontend images.

Backend:

Bash
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com

docker build -t job-tracker-backend ./backend
docker tag job-tracker-backend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-backend:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-backend:latest
Frontend:
Note: Create a .env file in the frontend/ directory with your backend's future public IP: VITE_API_URL=http://<BACKEND_IP>:8000 before building.

Bash
docker build -t job-tracker-frontend ./frontend
docker tag job-tracker-frontend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-frontend:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-frontend:latest
3. Deploy Infrastructure
Apply the rest of the Terraform configuration to provision the network, database, and ECS services.

Bash
cd terraform
terraform apply
4. Database Migrations
Because the RDS instance is securely placed in a private subnet, migrations must be run from within the VPC.

Navigate to the AWS ECS Console.

Select the job-tracker-cluster and choose Run new task.

Use the backend Task Definition, select the cluster's VPC and public subnets.

Under Container Overrides, enter the command: alembic, upgrade, head.

Run the task. Once it stops with Exit Code 0, the database tables are ready.
