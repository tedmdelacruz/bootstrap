# Bootstrap Starter Kit

A starter kit for bootstrapping projects by [tedmdelacruz](https://github.com/tedmdelacruz)

## Local Development
- Start the services:
	```sh
	docker compose up -d --build
	```

## Production Testing (Docker Compose)
- Use `docker-compose-prod.yml` to test the stack locally with production settings.
- Start all services:
  ```sh
  docker-compose -f docker-compose-prod.yml up --build
  ```

Backend: http://localhost:8000
Django Admin: http://localhost:8000/admin
Frontend: http://localhost:4173
