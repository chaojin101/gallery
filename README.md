## Development setup

### Backend

```sh
cd apps/backend
```

#### Set env variables

```sh
cp .env.example .env
```

Set the env variable in `.env` file.

#### Migrate database

```sh
bun i
bun run migrate
```

#### Run

```sh
bun dev
```

### Web

```sh
cd apps/web
```

#### Set env variables

```sh
cp .env.example .env
```

Set the env variable in `.env` file.

#### Run

```sh
bun i
bun dev
```

## Production setup

### Backend

Go through the steps in development setup before `Run` step.

#### Run

```sh
bun run start
```

### Web

Go through the steps in development setup before `Run` step.

#### Run

```sh
bun run build
bun run start
```
