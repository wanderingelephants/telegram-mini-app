const axios = require('axios');
const fs = require('fs');
const moment = require("moment")
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { postToGraphQL } = require("../lib/helper");
const { table } = require('console');
const cmots_api_token = process.env.cmots_api_token
const abbreviateColumnName = require("./abbreviateColumnName")

const axiosConfig = {
  headers: {
    'Authorization': `Bearer ${cmots_api_token}`
  }
};
const safeParseInt = (value) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? null : parsed;
};
const formatISTDateTime = () => moment().utcOffset(330).format("YYYY-MM-DD HH:mm:ss");
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const parsedDate = moment(dateStr, ["YYYY-MM-DD HH:mm:ss", "DD/MM/YYYY", "YYYY/MM/DD", "DD-MM-YYYY"]);
  return parsedDate.isValid() ? parsedDate.utcOffset(330).format("YYYY-MM-DD") : dateStr;
};
/*function cleanName(name) {
  return name
    .toLowerCase()
    .replace(/[&(),:.\/\s-]+/g, '_')  // Replace special chars with underscore
    .replace(/[%]+/g, '_percent')
    .replace(/_+/g, '_')              // Replace multiple underscores with one
    .replace(/^_|_$/g, '')            // Remove leading/trailing underscores
    .replace(/or/g, 'or')             // Keep 'or' as is (for cases like "sales_or_income")
    .trim();
}*/
function expandObject(input, co_code) {
  const output = [];
  const { COLUMNNAME, RID, rowno, ...rest } = input;
  const key = abbreviateColumnName(COLUMNNAME); // Clean the column name
  for (const prop in rest) {
    const match = prop.match(/^Y(\d{4})(\d{2})$/);// Match format YYYYYQQ
    if (match) {
      const year = parseInt(match[1], 10);
      const quarter = parseInt(match[2], 10);
      const month = quarter * 3;
      
      output.push({
        [key]: rest[prop],
        month,
        quarter,
        year,
        co_code,
        created_at: formatISTDateTime(),
        updated_at: formatISTDateTime(),
      });
    }
  }
  
  return output;
}
function transformKeysToLowercase(data, tableDef) {
  if (Array.isArray(data)) {

    data = data.map(item => transformKeysToLowercase(item, tableDef));
    return data
  }
  else if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      let value = data[key];
      let lowerKey = abbreviateColumnName(key);
      if (value !== null && typeof value === 'object') {
        acc[lowerKey] = transformKeysToLowercase(value, tableDef);
      } else {
        if (lowerKey === "date") lowerKey = "record_date"
        if (lowerKey === "cmotscode") lowerKey = "co_code"
        //console.log("lowerKey", lowerKey)
        const columnDef = tableDef.Columns.filter(c => c.Column_Name.toLowerCase() === lowerKey)[0]
        if (columnDef.Column_DataType === "text") value += ""
        acc[lowerKey] = value;
      }

      return acc;
    }, {});
  }
  return data;
}
async function persistData(inputJsonPath) {
  // Read and parse the JSON file
  const jsonData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
  // Create migration folder if it doesn't exist


  for (let table of jsonData) {
    
    const columns = table.Columns;
    columns.forEach(column => {
      column.Column_Name = column.Column_Name.trim()
      column.Column_Name = column.Column_Name.toLowerCase()
      const pgType = convertToPgType(column.Column_DataType);
      column.pgDataType = pgType
    });
    console.log(table.API_URL)
    //const match_sector = table.API_URL.match(/SectorWiseComp\/(\d+)/);
    //const sect_code = match_sector ? parseInt(match_sector[1]) : null;
    //const match_index = table.API_URL.match(/IndexWiseComp\/(\d+)/);
    //const index_code = match_index ? parseInt(match_index[1]) : null;
    let response;
    try {
      response = await axios.get(table.API_URL, axiosConfig);
    }
    catch (e) {
      console.log(e)
    }

    if (!response.data) {
      console.log("response.data is null", response)
      continue
    }
    if (!response.data.data) {
      console.log("response.data.data is null", response)
      continue
    }
    console.log("Record size", response.data.data.length)
    for (const record of response.data.data) {
      if (record.COLUMNNAME === null) continue;
      !record.COLUMNNAME ? await processNonResultsData(table, record) : await processResultsData(table, record) 
    }

  }



  //await postToGraphQL()
}
async function processResultsData(table, record) {
  const parts = table.API_URL.split('/');
  const len = parts.length;
  const key = abbreviateColumnName(record.COLUMNNAME); 
  // Number is either the last token or second last token
  const possibleNumber = parts[len - 2].match(/^\d+$/) ? parts[len - 2] : parts[len - 1];

  const co_code = parseInt(possibleNumber)

  const mutationVariables = expandObject(record, co_code)
  const tableName = (table['Table Name']);
  const insertMutation = `mutation ${tableName}_insert($objects: [${tableName}_insert_input!]!){
  insert_${tableName}(objects: $objects, on_conflict:{
    constraint: u_${tableName},
    update_columns: [${key}]
  }){
    returning{
      id
    }
  }
}`
  try {
    await postToGraphQL({
      query: insertMutation, variables: { objects: mutationVariables }
    })

  }
  catch (e) {
    console.log(e)
  }

}
async function processNonResultsData(table, record) {
  //console.log("processNonResultsData", record)
  let mutationVariables = {};
  mutationVariables = transformKeysToLowercase(record, table)
  mutationVariables["created_at"] = formatISTDateTime(); mutationVariables["updated_at"] = formatISTDateTime()
  if (mutationVariables["cmotscode"]) {
    mutationVariables["co_code"] = safeParseInt(mutationVariables["cmotscode"])
    delete mutationVariables.cmotscode
  }
  const apiInputKey = table["Input"]; //co_code, sect_code or index_code, passed as param to API_URL
  if ("co_code" === apiInputKey || "sect_code" === apiInputKey || "index_code" === apiInputKey) {
    if (!mutationVariables[apiInputKey]) {
      const parts = table.API_URL.split('/');
      const len = parts.length;
      const possibleNumber = parts[len - 2].match(/^\d+$/) ? parts[len - 2] : parts[len - 1];
      mutationVariables[apiInputKey] = parseInt(possibleNumber)
    }
  }
  const columns = table.Columns;
  const tableName = table["Table Name"];
  Object.keys(mutationVariables).forEach((key) => {
    const columnDef = columns.find(col => col.Column_Name.toLowerCase() === key.toLowerCase());
    //console.log("columnDef", columnDef)
    if (columnDef) {
      if (columnDef.Column_DataType === "date") {
        mutationVariables[key] = formatDate(mutationVariables[key]); // Convert to IST date format
      } else if (columnDef.Column_DataType.toLowerCase() === "integer" || columnDef.Column_DataType.toLowerCase === "int") {
        mutationVariables[key] = safeParseInt(mutationVariables[key]);
      }
    }
  });

  const insertMutation = `mutation ${tableName}_insert($object: ${tableName}_insert_input!){
      insert_${tableName}_one(object: $object, on_conflict:{
        constraint: u_${tableName},
        update_columns: [${table['UniqueColumns']}, updated_at]
      }){
        id
      }
    }`
  
  try {
    await postToGraphQL({
      query: insertMutation, variables: { object: mutationVariables }
    })

  }
  catch (e) {
    console.log(e)
  }
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
