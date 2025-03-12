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
    const response = await axios.get(table.API_URL, axiosConfig);
    response.data.data = response.data.data.map(obj => ({
      ...obj,
      created_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      updated_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  }));
    const transformedData = { ...response.data };

    if (transformedData.data) {
      console.log("TRANSFORM TO LOWER CASE")
      transformedData.data = transformKeysToLowercase(transformedData.data);
    }
    console.log(transformedData.data)
    let primary_column =  "co_code"
    if (tableName === "company_sector_master") primary_column = "sect_code"
    if (tableName === "company_index_master") primary_column = "index_code"
    const insertMutation = `mutation ${tableName}_insert($objects: [${tableName}_insert_input!]!){
      insert_${tableName}(objects: $objects, on_conflict:{
        constraint: ${tableName}_${primary_column}_key,
        update_columns: [${primary_column}, updated_at]
      }){
        returning{
          id
        }
      }
    }`
    await postToGraphQL({
       query: insertMutation, variables: {objects: transformedData.data}
     })
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