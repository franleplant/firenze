# Info

This folder defines a Docker Compose project for setting up a local PostgreSQL database for development and testing purposes.

# Execution

For running the project simply execute:
```bash
docker-compose up
```

# Configuration

Default configuration can be read in the .env file included.

## Database files

Files are stored and read from the location defined by the environment variable 'POSTGRES_HOST_PATH' which defaults to '/firenze-db'.
This files can be deleted before restarting the project for a clean database regeneration.

## Database port

The port is defined by the environment variable 'POSTGRES_HOST_PORT' and defaults to 1000.