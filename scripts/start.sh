#!/usr/bin/env bash
if [ ! -f backend/docker/adminer/adminer-4.8.1.php ]
then 
  # Download adminer if not there yet
  curl -L https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php -o backend/docker/adminer/adminer-4.8.1.php
fi

docker compose down --remove-orphans --rmi local --volumes
docker compose --env-file backend/.env.docker up -d