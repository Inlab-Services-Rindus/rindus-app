## Init
scrape-slack-info:
	@echo "Downloading slack info"
	@curl -s -o employee-api/cmd/import/resources/slack.json 'https://slack.com/api/users.list?pretty=1%20' --header 'Authorization: Bearer $(shell cat .env | grep -E '^SLACK_API_TOKEN' | cut -d'=' -f2)'
	@echo "Successfully done"

create-env:
	@echo "Copying examples to .env files"
	@cp .env.example .env
	@ln -sf ${PWD}/.env backend/.env
	@ln -sf ${PWD}/.env employee-api/.env
	@echo "Envs created succesfully. Please fill in SLACK_API_TOKEN in .env"

## Docker
docker/start:
	docker compose --env-file .env --env-file .env.docker up -d

docker/stop:
	docker compose stop

docker/clean:
	docker compose down --remove-orphans --rmi local --volumes

docker/reset: docker/clean docker/start