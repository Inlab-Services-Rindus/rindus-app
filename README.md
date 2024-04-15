# Rindus App

## Outline

- App
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:3000`
  - API: `http://localhost:8080`
- DB: Postgres @ `localhost:5432`
- Tools:
  - CloudBeaver (inspect DB): `http://localhost:8979`

## Running for the first time

1. Get the JSON exports of Personio (see [the following README](api/cmd/import/README.md))
2. Run the following command:

```shell
$ make create-env         # Copies .env.example in .env
$ # Fill in SLACK_API_TOKEN in .env
$ make scrape-slack-info
$ make docker/start       # Start all containers
```

## Running

```shell
$ make docker/start
```

## Useful info

### Using docker with command line

```shell
$ make docker/start  # Spins up all containes
$ make docker/stop   # Stops all containes
$ make docker/clean  # Remove all containes and volumes
$ make docker/reset  # Remove all containers and volumes and starts again
```

### Inspecting database (CloudBeaver)

Once you access `http://localhost:8979/`

1. Login with admin account `cbadmin/admin`
2. Default database is configured, just password has to be provided.

### Run all tests

```shell
$ scripts/test.sh
```
