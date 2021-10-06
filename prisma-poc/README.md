# prisma-poc

## Intro

This is a simple poc for evaluating prisma ORM on a Typescript NodeJS project.

## Set up a local db

Pull [postgres](https://hub.docker.com/_/postgres) image from dockerhub
```bash
docker pull postgres
```

Load an instance of postgres
```bash
docker run -p 1000:5432 --name prisma-poc-postgres -e POSTGRES_DB=prisma-poc -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres
```

Create tables and migration file
```bash
npx prisma migrate dev --name init
```

## Run
Execute the code which inserts some records into the database
```bash
npm run start
```

For consulting database tables, prisma comes with a tool called Prisma Studio which launches a local web interface:
```bash
npx prisma studio
```