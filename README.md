# Rindus App

## Running

### Full App

```shell
$ docker compose --env-file backend/.env.docker up -d
```

### Backend only

See `backend/README.md`

## Outline

- App
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:3000`
- DB: Postgres @ `localhost:5432`
- Adminer (inspect DB): `http://localhost:8080`
  - Default credentails can be found in `backend/.env.docker`
