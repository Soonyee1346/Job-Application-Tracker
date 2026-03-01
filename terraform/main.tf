resource "aws_ecs_cluster" "main" {
    name = "${var.project_name}-cluster"
}

resource "aws_security_group" "backend_sg" {
    name        = "${var.project_name}-backend-sg"
    vpc_id      = aws_vpc.main.id

    ingress {
        from_port   = 8000
        to_port     = 8000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"] # Restrict to loadbalancer
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_ecs_task_definition" "backend" {
    family                   = "backend"
    network_mode             = "awsvpc"
    requires_compatabilities = ["FARGATE"]
    cpu                      = "256"
    memory                   = "512"

    container_definitions = jsonencode([
        {
            name         = "backend"
            image        = "YOUR_AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com/job-tracker-backend:latest"
            essential    = true
            portMappings = [
                {
                    containerPort = 8000
                    hostPort      = 8000
                }
            ]
            environment  = [
                {
                    name = "DATABASE_URL"
                    value = "postgresql://postgres:jobtracker@{aws_db_instance.postgres.endopoint}/job_tracker
                }
            ]
        }
    ])
}

resource "aws_ecs_service" "backend" {
    name            = "backend-service"
    cluster         = aws_ecs_cluster.main.id
    task_definition = aws_ecs_task_definition.backend.arn
    desired_count   = 1
    launch_type     = "FARGATE"

    network_configuration {
        subnets          = aws_subnet.public[*].id
        security_groups   = [aws_security_group.backend_sg.id]
        assign_public_ip = true
    }
}

resource "aws_security_group" "db_sg" {
    name            = "${var.project_name}-db-sg"
    description     = "Allow inbound traffic from backend only"
    vpc_id          = aws_vpc.main.id

    ingress {
        from_port           = 5432
        to_port             = 5432
        protocol            = "tcp"
        security_groups     = [aws_security_group.backend_sg.id]
    }

    egress {
        from_port           = 0
        to_port             = 0
        protocol            = "-1"
        cidr_blocks         = ["0.0.0.0/0"]

    }
}

resource "aws_db_instance" "postgres" {
    identifier             = "${var.project_name}-db"
    allocated_storage      = 20
    storage_type           = "gp2"
    instance_class         = "db.t3.micro"
    engine                 = "postgres"
    engine_version         = "15.4"
    db_name                = "job_tracker"
    username               = "postgres"
    password               = "jobtracker" # Use a secrets manager in prod
    db_subnet_group_name   = aws_db_subnet_group.main.name
    vpc_security_group_ids = [aws_security_group.db_sg.id]
    skip_final_snapshot    = true
}