#!/bin/bash
# docker-compose-up.sh

# Read the .env file
source .env

# Start with core services
CMD="docker-compose -f docker-compose.local.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    CMD="$CMD -f docker-compose.yml"
fi

# Start the services
$CMD up -d