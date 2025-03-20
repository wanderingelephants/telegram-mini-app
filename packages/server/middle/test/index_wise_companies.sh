#!/bin/bash

# Load environment variables from .env file
source ../.env

# Define the array of index codes
index_codes=(20559 75348)

# Check if the token is set
if [ -z "$cmots_api_token" ]; then
    echo "Error: cmots_api_token is not set in the .env file"
    exit 1
fi

# Loop through each index code and make the curl request
for index in "${index_codes[@]}"; do
    echo "Fetching data for index: $index"
    curl -X GET "http://jwttoken.cmots.com/Aidea/api/IndexWiseComp/$index" \
         -H "Authorization: Bearer $cmots_api_token"
    echo -e "\n"
done
