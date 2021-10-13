[![Node.js CI](https://github.com/franleplant/firenze/actions/workflows/ci.yml/badge.svg)](https://github.com/franleplant/firenze/actions/workflows/ci.yml)

# Firenze

> Where the web3 renaissance happens.

## Getting Started

First, run the development server:

```bash
# install deps
yarn

# start the DB (docker has to be running)
yarn db

# update DB schema
yarn update-db

# start the app in dev
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `src/pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Database management

This project uses [prisma](https://www.prisma.io/) for managing database access and migrations and comes with a docker-compose project for starting up a local database.

### 1 - Start a local database

For starting a database:
```bash
yarn db
```
Note that this command will fail if docker is not started.

### 2 - Update database schema / generate a new migration
For updating your database or generating a new prisma migration (because of changes to the schema definition):
```bash
yarn db-update
```
If changes were made to the schema definition, a name will be asked for the new migration script. This script must be commited to git.

## Reference

- [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.