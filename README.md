# Starter Kit

A Django + React TypeScript starter kit for bootstrapping projects by [tedmdelacruz](https://github.com/tedmdelacruz)

## Technology Stack

**Backend:**
- Django 5.0+ with Django Ninja for type-safe REST APIs
- PostgreSQL database
- Redis for Celery task queue and caching
- Celery for background task processing

**Frontend:**
- React 19 with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- Radix UI for accessible component primitives
- React Router for client-side routing

**Infrastructure:**
- Docker & Docker Compose for containerization
- Development and production configurations

## Local Development

Start the services:

```sh
docker compose up -d --build
```

## Production Testing (Docker Compose)

Use `docker-compose-prod.yml` to test the stack locally with production settings.

Start all services:

```sh
docker-compose -f docker-compose-prod.yml up --build
```

- Backend: http://localhost:8000
- Django Admin: http://localhost:8000/admin
- Frontend: http://localhost:4173

## Setup

Simply run the following to get the latest release:

```sh
curl -sSL https://raw.githubusercontent.com/tedmdelacruz/starter-kit/refs/heads/master/start.sh | bash -s -- my-project-name
```