DATA_ROOT_FOLDER=/Users/sachetsingh1/telegram-mini-app/packages/data
node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/tables_all.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json
node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/tables_financials.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json
#first put master files for referential integrity
jq -s '[.[][]]' json/company_index_master.json json/company_sector_master.json json/company_master.json $(ls json/*.json | grep -v '_master.json' | grep -v 'all_tables.json') > json/all_tables.json
#node --env-file=../.env json_to_pgsql.js json/all_tables.json ../../hasura
cp json/all_tables.json $DATA_ROOT_FOLDER
#ls -l json | grep -v 'all_tables.json'| awk 'NR>1 {print "node --env-file=../.env persist_data_for_tables_json.js json/" $NF}'  


