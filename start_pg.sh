#!/bin/bash
#delete FROM hdb_catalog.schema_migrations;
# Load environment variables from .env.pg
if [ -f .env.pg ]; then
    source .env.pg
else
    echo ".env.pg file not found! Exiting..."
    exit 1
fi

# Ensure the local volume directory exists
mkdir -p "$LOCAL_VOLUME"

# Check if the container already exists
if [ $(docker ps -aq -f name=^${CONTAINER_NAME}$) ]; then
    echo "Container $CONTAINER_NAME already exists. Restarting..."
    docker start $CONTAINER_NAME
else
    echo "Starting a new PostgreSQL container..."
    docker run -d \
        --name $CONTAINER_NAME \
        -e POSTGRES_PASSWORD=$PG_PASSWORD \
        -p $PG_PORT:5432 \
        -v $LOCAL_VOLUME:/var/lib/postgresql/data \
        $PG_IMAGE
fi

# Display running containers
docker ps | grep $CONTAINER_NAME
