🚀 Job Application Tracker
A full-stack, cloud-native Kanban board application designed to track job applications through various stages (Wishlist, Applied, Interviewing, Offer, Rejected, Accepted, Declined).

Built with a modern stack featuring a React frontend, a FastAPI Python backend, and a PostgreSQL database, the entire application is containerized with Docker and provisioned on AWS using Terraform.

🛠️ Tech Stack
Frontend: React 19, Vite, TailwindCSS, @dnd-kit (Drag and Drop)

Backend: Python 3.11, FastAPI, SQLAlchemy, Alembic

Database: PostgreSQL

Infrastructure as Code (IaC): Terraform (AWS Provider ~> 5.0)

Cloud (AWS): VPC, Application Load Balancer (ALB), Elastic Container Service (ECS Fargate), Elastic Container Registry (ECR), Relational Database Service (RDS), IAM

✨ Features
Interactive Kanban Board: Drag and drop job cards between status columns to update their state instantly.

Dynamic Routing: The frontend automatically detects the environment and routes API traffic dynamically, eliminating the need to hardcode IP addresses.

Cloud-Native Architecture: Fully deployed on serverless AWS Fargate containers with a private, secure RDS database.

Enterprise Networking: Utilizes an Application Load Balancer (ALB) to route traffic seamlessly on port 80 (Frontend) and port 8000 (Backend API), deployed inside a custom VPC with public and private subnets.

Infrastructure as Code: 100% of the AWS infrastructure is defined in Terraform for exact reproducibility.

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
Frontend: Navigate to /frontend, install dependencies, build the project, and start Vite.

Bash
npm install
npm run dev

☁️ AWS Deployment Guide (Terraform)
This project uses Terraform to provision a secure network, an RDS Postgres database, an ALB, and an ECS Fargate cluster.

1. Provision ECR Repositories
First, create the Elastic Container Registries (ECR) to hold your Docker images.

Bash
cd terraform
terraform init
terraform apply -target aws_ecr_repository.backend -target aws_ecr_repository.frontend
2. Build and Push Images
Authenticate your local Docker daemon with AWS, then build and push the backend and frontend images to your newly created ECR repositories. (Replace <YOUR_AWS_ACCOUNT_ID> with your 12-digit AWS Account ID).

Authenticate:

Bash
$TOKEN = aws ecr get-login-password --region ap-southeast-2
docker login --username AWS --password $TOKEN <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com
Backend:

Bash
docker build -t job-tracker-backend ./backend
docker tag job-tracker-backend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-backend:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-backend:latest
Frontend:

Bash
docker build -t job-tracker-frontend ./frontend
docker tag job-tracker-frontend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-frontend:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-frontend:latest
3. Deploy the Infrastructure
Apply the rest of the Terraform configuration to provision the VPC, RDS database, Load Balancer, and ECS containers.

Bash
cd terraform
terraform apply
Note: Once this completes, Terraform will output your application_url (your Load Balancer's DNS name).

4. Initialize the Database
Because the RDS instance is securely placed in a private subnet, migrations must be executed from inside the VPC.

Navigate to the AWS ECS Console.

Select the job-tracker-cluster and choose Run new task.

Select Fargate compute.

Select the backend Task Definition.

Under Networking, select your VPC, the Public subnets, and the backend-sg security group. Ensure Auto-assign public IP is turned ON.

Under Container Overrides, expand the section and enter exactly: alembic,upgrade,head

Click Create and wait for the task to stop with Exit Code 0.

5. Access the Application
Open your browser and navigate to the application_url provided by Terraform (e.g., http://job-tracker-alb-xxxxx.ap-southeast-2.elb.amazonaws.com).

Thanks to dynamic frontend routing, your React app will automatically use this same URL to send API requests to your backend on port 8000!

🧹 Teardown & Clean Up
To avoid ongoing AWS charges, destroy the infrastructure when not in use:

Empty the ECR repositories:

Navigate to the AWS ECR Console.

Select the images inside job-tracker-backend and job-tracker-frontend and delete them.

Run the destroy command:

Bash
cd terraform
terraform destroy
