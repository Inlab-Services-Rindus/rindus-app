# Frontend

## Requirements

- Docker Desktop - if running on Docker
- Node ^18.XX.X (& npm) - if running locally

## Run

See `../README.md`

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
