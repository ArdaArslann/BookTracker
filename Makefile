.PHONY: install dev test lint lint-fix build preview

install:
	docker compose run --rm app npm ci

dev:
	docker compose run --rm --service-ports app npm run dev -- --host 0.0.0.0

test:
	docker compose run --rm app npm run test

lint:
	docker compose run --rm app npm run lint

lint-fix:
	docker compose run --rm app npm run lint:fix

build:
	docker compose run --rm app npm run build

preview:
	docker compose run --rm --service-ports app npm run preview -- --host 0.0.0.0
