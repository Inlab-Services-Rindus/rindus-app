create-env:
	@echo "Copying examples to .env files"
	@cp .env.example .env
	@ln -sf ${PWD}/.env* bff/
	@ln -sf ${PWD}/.env* api/
	@echo "Envs created succesfully. Please fill in \"changeme\" values in .env"

scrape-slack-info:
	@echo "Downloading slack info"
	@curl -s -o api/cmd/resources/slack.json 'https://slack.com/api/users.list?pretty=1%20' --header 'Authorization: Bearer $(shell cat .env | grep -E '^BFF_SLACK_API_TOKEN' | cut -d'=' -f2)'
	@echo "Successfully done"

DOCKER_COMPOSE_UP=docker compose --env-file .env --env-file .env.docker up -d

## Docker
docker/start:
	${DOCKER_COMPOSE_UP}

docker/start/api:
	${DOCKER_COMPOSE_UP} db cloudbeaver api

docker/stop:
	docker compose stop

docker/clean:
	docker compose down --remove-orphans --rmi local --volumes

docker/restart: docker/stop docker/start

docker/reset: docker/clean docker/start
