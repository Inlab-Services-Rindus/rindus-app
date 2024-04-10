## Init
create-env:
	@echo "Copying examples to .env files"
	cp .env.example .env
	@echo "Envs created succesfully"

## Docker
docker/start:
	docker compose --env-file .env --env-file .env.docker up -d

docker/stop:
	docker compose stop

docker/clean:
	docker compose down --remove-orphans --rmi local --volumes

docker/reset: docker/clean docker/start