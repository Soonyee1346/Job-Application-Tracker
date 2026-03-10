resource "aws_security_group" "alb_sg" {
    name        = "${var.project_name}-alb_sg"
    description = "Allow HTTP traffic to ALB"
    vpc_id      = aws_vpc.main.id

    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"] # allow public web traffic
    }

    ingress {
        from_port   = 8000
        to_port     = 8000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"] # allow public API traffic
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_lb" "main" {
    name               = "${var.project_name}-alb"
    internal           = false
    load_balancer_type = "application"
    security_groups    = [aws_security_group.alb_sg.id]
    subnets            = aws_subnet.public[*].id
}

resource "aws_lb_target_group" "backend" {
    name        = "${var.project_name}-tg-backend"
    port        = 8000
    protocol    = "HTTP"
    vpc_id      = aws_vpc.main.id
    target_type = "ip"

    health_check {
        path                = "/health/"
        interval            = 30
        timeout             = 5
        healthy_threshold   = 2
        unhealthy_threshold = 2
    }
}

resource "aws_lb_target_group" "frontend" {
    name        = "${var.project_name}-tg-frontend"
    port        = 80
    protocol    = "HTTP"
    vpc_id      = aws_vpc.main.id
    target_type = "ip"
}

resource "aws_lb_listener" "frontend_listener" {
    load_balancer_arn = aws_lb.main.arn
    port              = 80
    protocol          = "HTTP"

    default_action {
        type             = "forward"
        target_group_arn = aws_lb_target_group.frontend.arn
    }
}

resource "aws_lb_listener" "backend_listener" {
    load_balancer_arn = aws_lb.main.arn
    port              = 8000
    protocol          = "HTTP"

    default_action {
        type             = "forward"
        target_group_arn = aws_lb_target_group.backend.arn
    }
}

output "application_url" {
    value       = aws_lb.main.dns_name
    description = "Load Balancer URL"
}