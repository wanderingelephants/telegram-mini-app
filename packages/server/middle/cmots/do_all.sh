 node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/tables_all.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json
#  node csv_to_json.js /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/csv/tables_financials.csv /Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/json
#  jq -s '[.[][]]' json/company_index_master.json json/company_sector_master.json json/company_master.json $(ls json/*.json | grep -v '_master.json' | grep -v 'all_tables.json') > json/all_tables.json
#  node --env-file=../.env json_to_pgsql.js json/all_tables.json ../../hasura
#curl -X GET http://localhost:3000/api/chat/promptfields

#ls -l json | grep -v 'all_tables.json'| awk 'NR>1 {print "node --env-file=../.env persist_data_for_tables_json.js json/" $NF}'  

#  node --env-file=../.env persist_data_for_tables_json.js json/company_index_master.json
#   node --env-file=../.env persist_data_for_tables_json.js json/company_sector_master.json
#   node --env-file=../.env persist_data_for_tables_json.js json/company_master.json

# node --env-file=../.env persist_data_for_tables_json.js json/company_annual_report_data_declaration_list.json
#  node --env-file=../.env persist_data_for_tables_json.js json/company_auditor_s_report.json
#  node --env-file=../.env persist_data_for_tables_json.js json/company_balance_sheet.json
#  node --env-file=../.env persist_data_for_tables_json.js json/company_bankers.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_board_of_directors.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_capital_structure.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_cash_flow.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_cash_flow_ratios.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_chairman_s_report.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_chronological_history.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_compbackground.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_corporate_governance.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_crar.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_credit_rating_info.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_deferred_tax.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_director_s_report.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_efficiency_ratios.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_employee_count.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_exchange_holidays.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_financial_stability_ratios.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_finished_products.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_growth_ratio.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_half_yearly_results.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_history.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_insider_trading.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_liquidity_ratios.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_location.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_management_biodata.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_margin_ratio.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_nine_months_results.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_notes_to_account.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_performance_ratios.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_pledged_shares.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_profile.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_profit_and_loss.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_quarterly_ratio.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_quarterly_results.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_r_and_d.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_raw_material.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_related_party_transaction.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_balance_sheet_half_yearly.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_balance_sheet_quarterly.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_balance_sheet_yearly.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_result_data_declaration_list.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_results_today.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_return_ratios_bank.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_return_ratios_non_bank.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_sast.json

# node --env-file=../.env persist_data_for_tables_json.js json/company_shp_aggregate.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_shp_detailed.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_shp_more_than_1_percent.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_solvency_ratios.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_subsidiaries_jvs_collaborations.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_trailing_twelvemonths_ratios.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_valuation_ratios.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_yearly_ratio.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_yearly_results.json
# node --env-file=../.env persist_data_for_tables_json.js json/company_yearly_result_based_ratios.json

# node --env-file=../.env persist_data_for_tables_json.js json/company_index_wise_company.json

# node --env-file=../.env persist_data_for_tables_json.js json/company_sector_wise_company.json
