const axios = require('axios');
const fs = require('fs').promises;
const path = require("path")
const {
  nse_company_master_insert, nse_sector_master_insert, nse_index_master_insert,
  nse_sector_wise_company_insert, nse_index_wise_company_insert, nse_exchange_holidays_insert,
  nse_results_today_insert, nse_result_data_declaration_list_insert,
  nse_annual_report_data_declaration_list_insert, nse_company_profile_insert,
  nse_compbackground_insert, nse_board_of_directors_insert, nse_directors_report_insert,
  nse_chairmans_report_insert, nse_bankers_insert, nse_management_biodata_insert,
  nse_auditors_report_insert, nse_notes_toaccount_insert, nse_finished_products_insert,
  nse_raw_material_insert, nse_related_party_transaction_insert,
  nse_subsidiaries_jvs_and_collaborations_insert, nse_deferred_tax_insert,
  nse_r_and_d_insert, nse_chronological_history_insert, nse_company_history_insert,
  nse_location_insert, nse_credit_rating_info_insert, nse_employee_count_insert,
  nse_corporate_governance_insert, nse_capital_structure_insert,
  nse_pledge_shares_details_insert, nse_crar_insert, nse_bulk_deals_insert,
  nse_block_deals_insert, nse_insider_trading_insert,
  nse_substantial_acquisition_of_shares_and_takeovers_data_insert,
  nse_share_holding_pattern_detailed_insert, nse_share_holding_aggregate_insert,
  nse_share_holding_pattern_more_than_1_percent_insert, nse_margin_ratio_insert,
  nse_performance_ratios_insert, nse_efficiency_ratios_insert,
  nse_financial_stability_ratios_insert, nse_valuation_ratios_insert,
  nse_cash_flow_ratios_insert, nse_growth_ratio_insert, nse_liquidity_ratios_insert,
  nse_ttm_daily_ratios_insert, nse_quarterly_ratio_insert, nse_yearly_ratio_insert,
  nse_yearly_result_based_ratios_insert, nse_return_ratios_non_bank_insert,
  nse_return_ratios_bank_insert, nse_solvency_ratios_insert,
  nse_quarterly_results_insert, nse_profit_and_loss_insert, nse_balance_sheet_insert,
  nse_cash_flow_insert, nse_half_yearly_results_insert, nse_nine_months_results_insert,
  nse_yearly_reports_insert, nse_result_balance_sheet_asset_and_liabilities_quarterly_insert,
  nse_result_balance_sheet_asset_and_liabilities_half_yearly_insert,
  nse_result_balance_sheet_asset_and_liabilities_yearly_insert } = require("../mutations/mutations.js")

const { postToGraphQL } = require('../../../middle/lib/helper');

const TABLE_TO_MUTATION = {
  'nse_company_master': nse_company_master_insert,
  'nse_sector_master': nse_sector_master_insert,
  'nse_index_master': nse_index_master_insert,
  'nse_sector_wise_company': nse_sector_wise_company_insert,
  'nse_index_wise_company': nse_index_wise_company_insert,
  'nse_exchange_holidays': nse_exchange_holidays_insert,
  'nse_results_today': nse_results_today_insert,
  'nse_result_data_declaration_list': nse_result_data_declaration_list_insert,
  'nse_annual_report_data_declaration_list': nse_annual_report_data_declaration_list_insert,
  'nse_company_profile': nse_company_profile_insert,
  'nse_compbackground': nse_compbackground_insert,
  'nse_board_of_directors': nse_board_of_directors_insert,
  'nse_directors_report': nse_directors_report_insert,
  'nse_chairmans_report': nse_chairmans_report_insert,
  'nse_bankers': nse_bankers_insert,
  'nse_management_biodata': nse_management_biodata_insert,
  'nse_auditors_report': nse_auditors_report_insert,
  'nse_notes_toaccount': nse_notes_toaccount_insert,
  'nse_finished_products': nse_finished_products_insert,
  'nse_raw_material': nse_raw_material_insert,
  'nse_related_party_transaction': nse_related_party_transaction_insert,
  'nse_subsidiaries_jvs_and_collaborations': nse_subsidiaries_jvs_and_collaborations_insert,
  'nse_deferred_tax': nse_deferred_tax_insert,
  'nse_r_and_d': nse_r_and_d_insert,
  'nse_chronological_history': nse_chronological_history_insert,
  'nse_company_history': nse_company_history_insert,
  'nse_location': nse_location_insert,
  'nse_credit_rating_info': nse_credit_rating_info_insert,
  'nse_employee_count': nse_employee_count_insert,
  'nse_corporate_governance': nse_corporate_governance_insert,
  'nse_capital_structure': nse_capital_structure_insert,
  'nse_pledge_shares_details': nse_pledge_shares_details_insert,
  'nse_crar': nse_crar_insert,
  'nse_bulk_deals': nse_bulk_deals_insert,
  'nse_block_deals': nse_block_deals_insert,
  'nse_insider_trading': nse_insider_trading_insert,
  'nse_substantial_acquisition_of_shares_and_takeovers_data': nse_substantial_acquisition_of_shares_and_takeovers_data_insert,
  'nse_share_holding_pattern_detailed': nse_share_holding_pattern_detailed_insert,
  'nse_share_holding_aggregate': nse_share_holding_aggregate_insert,
  'nse_share_holding_pattern_more_than_1_percent': nse_share_holding_pattern_more_than_1_percent_insert,
  'nse_margin_ratio': nse_margin_ratio_insert,
  'nse_performance_ratios': nse_performance_ratios_insert,
  'nse_efficiency_ratios': nse_efficiency_ratios_insert,
  'nse_financial_stability_ratios': nse_financial_stability_ratios_insert,
  'nse_valuation_ratios': nse_valuation_ratios_insert,
  'nse_cash_flow_ratios': nse_cash_flow_ratios_insert,
  'nse_growth_ratio': nse_growth_ratio_insert,
  'nse_liquidity_ratios': nse_liquidity_ratios_insert,
  'nse_ttm_daily_ratios': nse_ttm_daily_ratios_insert,
  'nse_quarterly_ratio': nse_quarterly_ratio_insert,
  'nse_yearly_ratio': nse_yearly_ratio_insert,
  'nse_yearly_result_based_ratios': nse_yearly_result_based_ratios_insert,
  'nse_return_ratios_non_bank': nse_return_ratios_non_bank_insert,
  'nse_return_ratios_bank': nse_return_ratios_bank_insert,
  'nse_solvency_ratios': nse_solvency_ratios_insert,
  'nse_quarterly_results': nse_quarterly_results_insert,
  'nse_profit_and_loss': nse_profit_and_loss_insert,
  'nse_balance_sheet': nse_balance_sheet_insert,
  'nse_cash_flow': nse_cash_flow_insert,
  'nse_half_yearly_results': nse_half_yearly_results_insert,
  'nse_nine_months_results': nse_nine_months_results_insert,
  'nse_yearly_reports': nse_yearly_reports_insert,
  'nse_result_balance_sheet_asset_and_liabilities_quarterly': nse_result_balance_sheet_asset_and_liabilities_quarterly_insert,
  'nse_result_balance_sheet_asset_and_liabilities_half_yearly': nse_result_balance_sheet_asset_and_liabilities_half_yearly_insert,
  'Result Balance Sheet Asset and Liabilities Yearly': nse_result_balance_sheet_asset_and_liabilities_yearly_insert
};
async function fetchDataFromAPI(apiUrl) {
  try {
    const token = process.env.cmots_api_token;
    if (!token) {
      throw new Error('cmots_api_token environment variable is not set');
    }

    const axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await axios.get(apiUrl, axiosConfig);

    // Transform all keys to lowercase in the response data
    const transformedData = { ...response.data };

    if (transformedData.data) {
      transformedData.data = transformKeysToLowercase(transformedData.data);
    }

    return transformedData;
  } catch (error) {
    console.error(`Error fetching data from ${apiUrl}:`, error.message);
    throw error;
  }
}

// Function to execute GraphQL mutation with provided variables
async function executeMutation(mutation, variables) {
  try {
    const result = await postToGraphQL({ query: mutation, variables });
    return result;
  } catch (error) {
    console.error('Error executing mutation:', error.message);
    throw error;
  }
}
function transformKeysToLowercase(data) {
  if (Array.isArray(data)) {
    return data.map(item => transformKeysToLowercase(item));
  } else if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      let lowerKey = key.toLowerCase();
      if (lowerKey === "date")  lowerKey = "record_date"
      if (value !== null && typeof value === 'object') {
        acc[lowerKey] = transformKeysToLowercase(value);
      } else {
        acc[lowerKey] = value;
      }

      return acc;
    }, {});
  }
  return data;
}
function getURLWithCoCode(inputUrl, coCode) {
  const urlParts = inputUrl.split('/');

  // Find the last numeric segment
  for (let i = urlParts.length - 1; i >= 0; i--) {
    if (!isNaN(urlParts[i]) && urlParts[i].trim() !== '') {
      urlParts[i] = coCode;
      break;
    }
  }

  return urlParts.join('/');
}
async function loadFinancialData(schemaFilePath) {
  try {
    const companyListQuery = `query getcompanies{
  nse_company_master(where: {companyname: {_like: "%ACC%"}}){
    companyname
    sectorname
    co_code
  }
}`
    const resp = await executeMutation(companyListQuery, {})
    const companyList = resp.data.nse_company_master
    console.log("companyList", companyList)
    // Read and parse the schema JSON file
    for (const company of companyList) {
      const co_code = company.co_code
      const schemaContent = await fs.readFile(schemaFilePath, 'utf8');
      const schema = JSON.parse(schemaContent);
      for (const table of schema) {
        const tableName = table["Table Name"]
        const mutation = TABLE_TO_MUTATION[tableName]

        let apiUrl = table["API_URL"]
        apiUrl = getURLWithCoCode(apiUrl, co_code)
        try {
          // Fetch data from the main API
          const apiResponse = await fetchDataFromAPI(apiUrl);

          if (apiResponse.success && apiResponse.data) {
            // For single objects
            if (!Array.isArray(apiResponse.data)) {
              const variables = {
                object: apiResponse.data
              };
              await executeMutation(mutation, variables);
              console.log(`Inserted data into ${tableName}`);
            }
            // For array of objects
            else {
              for (const record of apiResponse.data) {
                const variables = {
                  object: record
                };
                await executeMutation(mutation, variables);
              }
              console.log(`Inserted ${apiResponse.data.length} records into ${tableName}`);
            }
          }
        } catch (error) {
          console.error(`Error processing ${tableName}:`, error.message);
        }
      }
    }

  }
  catch (e) {
    console.error(e)
  }
}
const route = async (req, res) => {
  try {
    const inputJsonPath = req.query.jsonToLoad; //"load_company_master_data.json"
    console.log("inputJsonPath", inputJsonPath)
    const absoluteFilePath = path.resolve(process.cwd(), inputJsonPath);
    console.log(absoluteFilePath)
    const resp = await loadFinancialData(absoluteFilePath)
    res.status(200).json("ok")
  }
  catch (e) {
    res.status(500).json(e)
  }

}
module.exports = route
/*if (require.main === module) {
  if (process.argv.length < 3) {
    console.error('Usage: node --env-file=.env script.js <input_json_path>');
    process.exit(1);
  }
  console.log(process.argv)
  const inputJsonPath = process.argv[2];
  
  console.log(inputJsonPath)
  
  loadFinancialData(inputJsonPath)
  .then(() => console.log('Data loading complete'))
  .catch(err => console.error('Error:', err));
}*/