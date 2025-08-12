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
# Build the images
docker compose up -d --build

# Run the DB migrations
docker compose exec backend ./manage.py migrate

# Create a superuser
docker compose exec backend ./manage.py createsuperuser
```

Run the tests:

```sh
docker compose exec backend ./manage.py test -v 3 --keepdb
```

## URLs
- Base API: http://localhost:8000/api
- API Docs: http://localhost:8000/api/docs
- Django Admin: http://localhost:8000/admin
- React Frontend: http://localhost:4173

## Production Testing (Docker Compose)

Use `docker-compose-prod.yml` to test the stack locally with production settings.

Start all services:

```sh
docker compose -f docker-compose-prod.yml up --build
```

## Usage

Run the following script to fetch the latest release into a directory named `my-project`:

```sh
curl -sSL https://raw.githubusercontent.com/tedmdelacruz/starter-kit/refs/heads/master/start.sh | bash -s -- my-project
```