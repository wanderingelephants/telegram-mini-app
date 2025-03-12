# cd hasura_test
# rm -rf *
# cd ..
# cd hasura_mutations
# rm -f mutation*.js
# cd ..
 node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/master.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json/master.json
 node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/company_profile.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json/company_profile.json
 node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/shareholding.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json/shareholding.json
 node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/standalone_ratios.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json/standalone_ratios.json
 node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/bulk_deals.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json/bulk_deals.json
 node  --env-file=../.env create_schema_from_api /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/standalone_results_headers.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json
# #ls -l json | awk 'NR>1 {print "node json_to_pgsql.js json/" $NF " hasura_test hasura_mutations"}'
node json_to_pgsql.js json/master.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_profile.json hasura_test hasura_mutations
node json_to_pgsql.js json/shareholding.json hasura_test hasura_mutations
node json_to_pgsql.js json/standalone_ratios.json hasura_test hasura_mutations
node json_to_pgsql.js json/bulk_deals.json hasura_test hasura_mutations

node json_to_pgsql.js json/company_balance_sheet.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_cash_flow.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_half_yearly_results.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_nine_months_results.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_profit_and_loss.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_quarterly_results.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_result_balance_sheet_half_yearly.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_result_balance_sheet_quarterly.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_result_balance_sheet_yearly.json hasura_test hasura_mutations
node json_to_pgsql.js json/company_yearly_reports.json hasura_test hasura_mutations



#node  --env-file=../.env persist_data_for_tables_json.js json/company_master_only.json
#node  --env-file=../.env persist_data_for_tables_json.js json/company_sector_master_only.json
#node  --env-file=../.env persist_data_for_tables_json.js json/company_profile_1.json
#echo "module.exports = {$(awk '/^const / {print $2}' hasura_mutations/mutations.js | tr '\n' ',' | sed 's/,$//')};" >> hasura_mutations/mutations.js

#curl http://localhost:3000/api/cmots/dataloadmaster?jsonToLoad=cmots/json/master.json
#curl http://localhost:3000/api/cmots/dataloadcompany?jsonToLoad=cmots/json/company_profile.json
#curl "http://localhost:3000/api/cmots/dataloadcompany?jsonToLoad=cmots/json/bulk_deals.json"
#curl "http://localhost:3000/api/cmots/dataloadcompany?jsonToLoad=cmots/json/standalone_ratios.json"
#curl "http://localhost:3000/api/cmots/dataloadcompany?jsonToLoad=cmots/json/company_cash_flow.json"