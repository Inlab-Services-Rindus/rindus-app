#!/usr/bin/env bash
docker compose down --remove-orphans --rmi local --volumes
docker compose --env-file backend/.env.docker up -d