# Rindus App

## Running

### Full App

```shell
$ scripts/start.sh
```

#### With real data

By default the project will scaffold with specific data. If you want to start the application with the whole Persoio database:

1. Get the JSON export of Personio (see [the following README](backend/seeds/README.md))
2. Run again the same command:

```shell
$ scripts/start.sh
```

### Backend only

See `backend/README.md`

### Run all tests

```shell
$ scripts/test.sh
```

## Outline

- App
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:3000`
- DB: Postgres @ `localhost:5432`
- Adminer (inspect DB): `http://localhost:8080`
  - Default credentails can be found in `backend/.env.docker`
