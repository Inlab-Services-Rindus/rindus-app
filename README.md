# Rindus App

## Running

### Frontend with mock

```shell
$ docker compose -f frontend/compose.yml -f frontend/mock/compose.yml up -d
```

### Backend

```shell
$ docker compose -f backend/compose.yml up -d
```

### Full App

```shell
$ docker compose -f frontend/compose.yml -f frontend/mock/compose.yml up -d
$ docker compose -f backend/compose.yml up -d
```
