# Backend

API for Rindus App

## Requirements

- Docker desktop
- Node ^18.XX.X (& npm)

## Installation

1. Install depencies and init environment

```shell
$ cp .env.example .env
$ # Fill in correct secrets in .env
$ npm install
```

2. Init database (Complete steps of `seeds/README.md`)

```shell
$ docker compose up -d db adminer
$ npx knex migrate:up
$ npx knex seed:run
```

## Start project

```shell
$ docker compose up -d
```

### Debug

Attach to default port 9229

### Run test

- Unit tests `npm run test`
  - Watching files `npm run test:watch`
- Integration tests `npm run integration`

### TODO

- updated_at not working on Postgres
