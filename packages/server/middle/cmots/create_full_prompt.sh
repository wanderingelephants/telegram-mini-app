source ../../../.env
PROMPT_TEMPLATE=../../middle/routes/api/chat/prompts/stock_market_chat_system_prompt.txt
FIELDS_FILE="$DATA_ROOT_FOLDER/prompts_fields.json"
OUTPUT_FILE="$DATA_ROOT_FOLDER/full_prompt.txt"

# Use awk for direct replacement
awk -v replacement="$(cat "$FIELDS_FILE")" '{gsub(/\{\{cached_pre_loaded_graphql_fields\}\}/, replacement)}1' "$PROMPT_TEMPLATE" > "$OUTPUT_FILE"
