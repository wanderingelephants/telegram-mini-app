#!/bin/bash

api_server="https://bf24-2409-40f2-143-c9a2-39a9-d6be-2867-cbc6.ngrok-free.app"
# Check if both directories are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <input_directory_path> <output_directory_path>"
    exit 1
fi

input_directory="$1"
output_directory="$2"

IFS='/' read -r -a path_tokens <<< "$input_directory"
year="${path_tokens[-3]}"
month="${path_tokens[-2]}"
day="${path_tokens[-1]}"

# Format as yyyy-mm-dd
announcement_date="$year-$month-$day"
# Check if input directory exists
if [ ! -d "$input_directory" ]; then
    echo "Error: Input directory '$input_directory' does not exist"
    exit 1
fi

# Check if output directory exists, if not create it
if [ ! -d "$output_directory" ]; then
    echo "Creating output directory: $output_directory"
    mkdir -p "$output_directory"
fi

# Process each .txt file
for file in "$input_directory"/*.txt; do
    # Skip if file name already ends with _api_response.txt
    if [[ "$file" == *"_api_response.txt" ]]; then
        continue
    fi

    echo "Processing file: $file"
    
    # Read file content
    content=$(cat "$file")
    
    # Escape special characters in the content for JSON
    escaped_content=$(echo "$content" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
    filename=$(basename "$file")
    first_token="${filename%%_*}"
    # Prepare JSON payload with the exact structure specified
    json_data="{
        \"distilledModel\": \"announcements_summary\",
        \"llm\": \"Ollama\",
        \"singleShotPrompt\": true,
        \"streaming\": false,
        \"customData\": {
            \"stock_symbol\": \"$first_token\",
            \"announcement_date\": \"$announcement_date\"
        },
        \"messages\": [
            {
                \"role\": \"user\",
                \"content\": \"$escaped_content\"
            }
        ]
    }"
    
    # Get the base filename without path
    
    # Generate output filename in the output directory
    output_file="$output_directory/${filename%.*}_api_response.txt"
    
    # Make API call and save response
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$json_data" \
        $api_server/api/chat/reasoning > "$output_file"
    
    # Check if curl was successful
    if [ $? -eq 0 ]; then
        echo "Response saved to: $output_file"
    else
        echo "Error occurred while processing $file"
    fi
    
    # Sleep for 3 seconds before next request
    sleep 3
done

echo "Processing complete!"
