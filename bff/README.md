# Backend

API for Rindus App

## Requirements

- Docker desktop
- Node ^18.XX.X (& npm)

## Start application

```shell
$ docker compose --env-file .env.docker up  -d
```

## Start full project

See `../README.md`

## Change config

```shell
$ cp .env.example .env
$ # Restart api container
```

### Read Swagger

Go to https://editor-next.swagger.io/ and copy the contents of `openapi.yml`.

### Debug

Attach to default port 9229

### Run test

- Unit tests `npm run test`
  - Watching files `npm run test:watch`
- Integration tests `npm run integration`

### TODO

- updated_at not working on Postgres
