# Frontend

## Requirements

- Docker Desktop - if running on Docker
- Node ^18.XX.X (& npm) - if running locally

## Run

### Docker

In order to run the frontend project with a backend mock (Wiremock)

```shell
$ docker compose -f compose.yml -f mock/compose.yml up -d
$ open http://localhost:5173
```

If you just want to start frontend app (using the real backend), simply use `docker compose up -d`

### Useful docker commands

#### Restart the server

```shell
$ docker compose restart app
```

#### Inspect Vite console output

```shell
$ docker compose logs app
```

With `-f` option you can follow the log in real time

#### npm install

1. Add dependency to `package.json`
2. Restart the container `docker compose stop app && docker compose up app -d`

### Locally

```shell
$ npm install
$ npm run dev
```
