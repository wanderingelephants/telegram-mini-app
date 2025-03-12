const axios = require('axios');
const fs = require('fs');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { postToGraphQL } = require("../lib/helper");
const cmots_api_token = process.env.cmots_api_token
const axiosConfig = {
  headers: {
    'Authorization': `Bearer ${cmots_api_token}`
  }
};
function transformKeysToLowercase(data) {
  if (Array.isArray(data)) {
    
      data = data.map(item => transformKeysToLowercase(item));
      return data
    }
  else if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      const lowerKey = key.toLowerCase();

      if (value !== null && typeof value === 'object') {
        acc[lowerKey] = transformKeysToLowercase(value);
      } else {
        acc[lowerKey] = value;
      }

      return acc;
    }, {});
  }
  data[created_at] = new Date(); data[updated_date] = new Date()
  //console.log("transformKeysTOLowercase", data)
  return data;
}
async function persistData(inputJsonPath) {
  // Read and parse the JSON file
  const jsonData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
  // Create migration folder if it doesn't exist


  for (table of jsonData) {
    const tableName = (table['Table Name']);
    const columns = table.Columns;
    columns.forEach(column => {
      column.Column_Name = column.Column_Name.trim()
      column.Column_Name = column.Column_Name.toLowerCase()
      const pgType = convertToPgType(column.Column_DataType);
      column.pgDataType = pgType
    });
    console.log(table.API_URL)
    const match_sector = table.API_URL.match(/SectorWiseComp\/(\d+)/);
    const sect_code = match_sector ? parseInt(match_sector[1]) : null;
    const match_index = table.API_URL.match(/IndexWiseComp\/(\d+)/);
    const index_code = match_index ? parseInt(match_index[1]) : null;
    let response;
    try{
      response = await axios.get(table.API_URL, axiosConfig);
    }
    catch(e){
      console.log(e)
    }
    
    if (!response.data){
      console.log("response.data is null", response)
      continue
    }
    if (!response.data.data){
      console.log("response.data.data is null", response)
      continue
    }
    response.data.data = response.data.data.map(obj => ({
      ...obj,
      ...(obj.CMOTSCode !== undefined ? { CMOTSCode: parseInt(obj.CMOTSCode) } : {}),
      ...(obj.co_code !== undefined ? { co_code: parseInt(obj.co_code) } : {}),
      ...(sect_code !== null ? { sect_code } : {}),
      ...(index_code !== null ? { index_code } : {}),
      created_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      updated_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  }));
    
    const transformedData = { ...response.data };

    if (transformedData.data) {
      transformedData.data = transformKeysToLowercase(transformedData.data);
    }
    else {
      console.log("transformedData.data not found", tableName)
      console.log(transformedData)
      continue;
    }
    if (transformedData.data.data && transformedData.data.data.length > 0){
      console.log("transformedData.data.data legnth 0", tableName)
      console.log(transformedData)
      continue;
    }
    let unique_columns =  "co_code"
    if (tableName === "company_sector_master") unique_columns = "sect_code"
    if (tableName === "company_index_master") unique_columns = "index_code"
    let unique_constraint_key = `${tableName}_${unique_columns}_key`
    
    if (tableName === "company_sector_wise_company"){
      unique_columns = "sect_code, co_code"
      unique_constraint_key = `${tableName}_${unique_columns.replaceAll(", ", "_")}`
      
    } 
    if (tableName === "company_index_wise_company"){
      unique_columns = "index_code, cmotscode"
      unique_constraint_key = `${tableName}_${unique_columns.replaceAll(", ", "_")}`
    }
    if (tableName === "company_annual_report_data_declaration_list"){
      unique_columns = "reporttype, reportdate, co_code"
      unique_constraint_key = "company_annual_report_data_declaration_list_uniq";//`${tableName}_${unique_columns.replaceAll(", ", "_")}`
    }
    if (tableName === "company_result_data_declaration_list"){
      unique_columns = "reporttype, resultdate, co_code"
      unique_constraint_key = "company_result_data_declaration_list_reporttyperesultdatecocode"; //`${tableName}_${unique_columns.replaceAll(", ", "_")}`
    }   
    for (const record of transformedData.data){
      const insertMutation = `mutation ${tableName}_insert($object: ${tableName}_insert_input!){
        insert_${tableName}_one(object: $object, on_conflict:{
          constraint: ${unique_constraint_key},
          update_columns: [${unique_columns}, updated_at]
        }){
          id
        }
      }`
      try{
        await postToGraphQL({
          query: insertMutation, variables: {object: record}
        })
      
      }
      catch(e){
        console.log(e)
      }
    }
    
    
  }



  //await postToGraphQL()
}

/**
 * Convert database types to PostgreSQL types
 * @param {string} dataType - Original data type
 * @return {string} - PostgreSQL data type
 */
function convertToPgType(dataType) {
  const lowerType = dataType.toLowerCase();

  if (lowerType.startsWith('varchar')) {
    return 'text';
  } else if (lowerType.startsWith('timestamp')) {
    return 'timestamptz';
  } else if (lowerType.startsWith('float') || lowerType.startsWith('numeric') || lowerType.startsWith('number')) {
    return 'numeric';
  } else if (lowerType.startsWith('bigint')) {
    return 'bigint';
  } else if (lowerType.startsWith('int')) {
    return 'integer';
  } else if (lowerType.startsWith('date')) {
    return 'date';
  } else if (lowerType.startsWith('boolean')) {
    return 'boolean';
  }

  // Default to text for unknown types
  return 'text';
}

module.exports = { persistData };

// If this script is run directly
if (require.main === module) {
  if (process.argv.length < 3) {
    console.error('Usage: node script.js <input_json_path> <migration_folder_path>');
    process.exit(1);
  }

  const inputJsonPath = process.argv[2];

  persistData(inputJsonPath);
}
