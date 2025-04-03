DATA_ROOT_FOLDER=/Users/sachetsingh1/telegram-mini-app/packages/data
node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/tables_all.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json
node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/tables_financials.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json
node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/tables_price_volume.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json
#first put master files for referential integrity
jq -s '[.[][]]' json/company_index_master.json json/company_sector_master.json json/company_master.json $(ls json/*.json | grep -v '_master.json' | grep -v 'all_tables.json') > json/all_tables.json
#node --env-file=../.env json_to_pgsql.js json/all_tables.json ../../hasura
#node --env-file=../.env json_to_pgsql.js json/company_historical_price_volume_by_date.json ../../hasura
#node --env-file=../.env json_to_pgsql.js json/company_price_volume_daily_moving_averages.json ../../hasura

cp json/all_tables.json $DATA_ROOT_FOLDER

#node icicidirect_symbols.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/icicidirect_master.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json

