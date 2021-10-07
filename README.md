[![Node.js CI](https://github.com/franleplant/firenze/actions/workflows/ci.yml/badge.svg)](https://github.com/franleplant/firenze/actions/workflows/ci.yml)

# Firenze

> Where the web3 renaissance happens.

## Getting Started

First, run the development server:

```bash
# install deps
yarn

# TODO start the DB
yarn dev-db

# start the app in dev
yarn dev
```
## TypeORM

Column data types https://typeorm.io/#/undefined/column-data-types

Other ways of defining entities: https://typeorm.io/#/separating-entity-definition/extending-schemas

**How migrations work** : https://github.com/typeorm/typeorm/blob/master/docs/migrations.md (`typeorm migration:create -n PostRefactoring`)
Sync: https://github.com/typeorm/typeorm/blob/master/docs/faq.md

`TYPEORM_CONNECTION = postgres
TYPEORM_HOST = localhost
TYPEORM_USERNAME = postgres
TYPEORM_PASSWORD = postgres
TYPEORM_DATABASE = typeorm-poc-db
TYPEORM_PORT = 1000
TYPEORM_SYNCHRONIZE = true
TYPEORM_LOGGING = true
TYPEORM_ENTITIES = dist/src/orm/entity/**/*.js"
TYPEORM_MIGRATIONS = src/orm/migration/*{.ts,.js}`

## Run

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `src/pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
