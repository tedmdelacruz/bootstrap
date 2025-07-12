# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Django + React TypeScript starter kit with Docker containerization. The project consists of:

- **Backend**: Django 5.0+ with Django Ninja for API, PostgreSQL database, Redis for Celery task queue
- **Frontend**: React 19 with TypeScript, Vite, TailwindCSS, and Radix UI components
- **Infrastructure**: Docker Compose for development and production deployments

## Architecture

### Backend Structure
- `backend/app/` - Django project configuration
- Add your own Django apps here

### Frontend Structure
- `frontend/src/components/` - React components including auth forms and UI components in `ui/` subdirectory
- `frontend/src/lib/` - Utilities, API clients, auth, routing, and types
- `frontend/src/pages/` - Page components (Dashboard, Login, Signup)

### Key Technologies
- Django Ninja for type-safe REST APIs
- Django's built-in User model (easily customizable by adding AUTH_USER_MODEL setting)
- Celery for background tasks with Redis broker
- React Router for frontend routing
- Radix UI + TailwindCSS for component styling

## Development Commands

### Starting the Development Environment
```bash
# Start all services in development mode
docker compose up -d --build

# View logs
docker compose logs -f [service_name]
```

### Frontend Development
```bash
# Install dependencies (inside container or locally)
yarn install

# Development server
yarn dev

# Build for production
yarn build

# Lint code
yarn lint

# Type checking
yarn type-check

# Preview production build
yarn preview
```

### Backend Development
```bash
# Django management commands (run inside container)
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
python manage.py shell

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Run Celery worker manually
celery -A app worker --loglevel=info
```

### Service URLs
- Frontend: http://localhost:5173 (dev) / http://localhost:4173 (prod)
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin
- Database: localhost:5432
- Redis: localhost:6379

## Production Testing

Use `docker-compose-prod.yml` for local production testing:
```bash
docker-compose -f docker-compose-prod.yml up --build
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:
- Django settings (SECRET_KEY, DEBUG, ALLOWED_HOSTS)
- Database URL
- CORS origins for frontend
- Redis/Celery configuration

## API Architecture

The backend uses Django Ninja for type-safe APIs with routers:
- `/api/auth/` - User authentication endpoints (login, register, profile, logout)
- Add your own API routers here by following the existing pattern in `backend/app/urls.py`

## Common Tasks

### Database Operations
Always run migrations after model changes:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Adding New Dependencies
- Backend: Add to `requirements.txt`
- Frontend: Use `yarn add <package>`

### Debugging
- Backend: Use `ipdb` debugger (already installed)
- Set `CELERY_TASK_ALWAYS_EAGER=True` in `.env` to run tasks synchronously during development