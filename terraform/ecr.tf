resource "aws_ecr_repository" "backend" {
    name                 = "job-tracker-backend"
    image_tag_mutability = "IMMUTABLE"

    image_scanning_configuration {
        scan_on_push = true
    }
}

resource "aws_ecr_repository" "frontend" {
    name                 = "job-tracker-frontend"
    image_tag_mutability = "IMMUTABLE"

    image_scanning_configuration {
        scan_on_push = true
    }
}

output "backend_repo_url" {
    value = aws_ecr_repository.backend.repository_url
}

output "frontend_repo_url" {
    value = aws_ecr_repository.frontend.repository_url
}