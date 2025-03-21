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
let key_category = ""
function expandObject(input, co_code, isconsolidated) {
  const output = [];
  const { COLUMNNAME, RID, rowno, ...rest } = input;
  let key = COLUMNNAME//abbreviateColumnName(COLUMNNAME); // Clean the column name
  if (key.endsWith(":")) {
    key_category = key;
    key = ""
  }
  for (const prop in rest) {
    const match = prop.match(/^Y(\d{4})(\d{2})$/);// Match format YYYYYQQ
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const quarter = month / 3;
      
      output.push({
        key,
        key_category,
        value: rest[prop],
        isconsolidated,
        month,
        quarter,
        year,
        co_code,
        rid: RID,
        rowno, 
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
async function processTableApiURL(table, maxTries = 3) {
  let attempts = 0;
  let response;

  while (attempts < maxTries) {
    try {
      console.log(table.API_URL)
      response = await axios.get(table.API_URL, axiosConfig);
      if (!response.data) {
        console.log("response.data is null", response);
        return;
      }
      if (!response.data.data) {
        console.log("response.data.data is null for url", table.API_URL, response.data);
        return;
      }
      console.log("Record size", response.data.data.length);
      
      if (response.data.data.length > 0) {
        if (response.data.data[0].rowno) {
          response.data.data = response.data.data.sort((a, b) => a.rowno - b.rowno);
          await processResultsData(table, response);
          return;
        }
      }
      for (const record of response.data.data) {
        if (record.COLUMNNAME === null) continue;
        if (!record.COLUMNNAME) await processNonResultsData(table, record);
      }
      return; // Exit function if API call is successful
    } catch (e) {
      console.error(`Attempt ${attempts + 1} failed:`, e.message, table.API_URL);
      if (e.code === 'ETIMEDOUT') {
        attempts++;
        if (attempts < maxTries) {
          console.log(`Retrying (${attempts}/${maxTries})...`);
          await new Promise(res => setTimeout(res, 2000)); // Wait before retrying
        }
      } else {
        break; // If the error is not a timeout, stop retrying
      }
    }
  }
  console.error("Max retries reached. Unable to fetch data.");
}
async function getMasterCodes(masterTableName){
  let codes =  []
  let code_column_name = ""
  switch (masterTableName.toLowerCase()){
    case "company_index_master":
      code_column_name = "index_code"
      break;
    case "company_sector_master":
      code_column_name = "sect_code"
      break;
    case "company_master":
      code_column_name = "co_code"
      break;
      
  }
  try{
    const query = `query get_${masterTableName}{
      ${masterTableName}{
        ${code_column_name}
      }
    }`
    const resp = await postToGraphQL({query, variables:{}})
    codes = resp.data[masterTableName].map(o => o[`${code_column_name}`])
  }
  catch(e){
    console.error(e)
  }
  return codes
}
async function persistData(inputJsonPath) {
  let t1 = new Date()
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
    
    if (table["Table Name"].toLowerCase().endsWith("_master"))
    {
      await processTableApiURL(table)
      return
    }
    if (table.Input === "index_code" || table.Input  === "sect_code" || table.Input ===  "co_code"){
      await processChildrenOfMaster(table)
      return
    }
    if (table.Input === "latestdate"){
      const latestDate = moment().subtract(1, "days").utcOffset(330).format("YYYY-MM-DD");
      table.API_URL = table.API_URL.replace(/[^/]+$/, latestDate);
      console.log(table.API_URL);
      await processTableApiURL(table)
      return
    }
    
  }
  let t2 = new Date()
  console.log("time taken", t2.getTime() - t1.getTime())

}
async  function processChildrenOfMaster(table){
  let masterCodes = []
    switch(table.Input){
      case "index_code":
      console.log("iterate over index code");
      masterCodes = await getMasterCodes("company_index_master")
      for (const sect_code of masterCodes){
        table.API_URL = table.API_URL.replace(/\/(\d+)(\/[^\/]+)?$/, `/${sect_code}$2`);
        console.log(table.API_URL)
        await processTableApiURL(table)
      }
      
      break;
      case "sect_code":
      masterCodes = await getMasterCodes("company_sector_master")
        
      console.log("iterate over sect code");
      for (const sect_code of masterCodes){
        table.API_URL = table.API_URL.replace(/\/(\d+)(\/[^\/]+)?$/, `/${sect_code}$2`);
        await processTableApiURL(table)
      }
      break;
      case "co_code":
      masterCodes = await getMasterCodes("company_master")
      for (const co_code of masterCodes){
        table.API_URL = table.API_URL.replace(/\/(\d+)(\/[^\/]+)?$/, `/${co_code}$2`);
        await processTableApiURL(table)
        if (table.API_URL.endsWith("/C")){
          table.API_URL = table.API_URL.replace(/\/[^\/]+$/, `/S`);
          await processTableApiURL(table)
        }
        else if (table.API_URL.endsWith("/S")){
          table.API_URL = table.API_URL.replace(/\/[^\/]+$/, `/C`);
          await processTableApiURL(table)
        }
      }
      
      break;
    }
}
async function processResultsData(table, response) {
  const parts = table.API_URL.split('/');
  const isconsolidated = parts[parts.length - 1]  === "C"  ? true : false
  const len = parts.length;
  const possibleNumber = parts[len - 2].match(/^\d+$/) ? parts[len - 2] : parts[len - 1];
  const co_code = parseInt(possibleNumber)
  let mutationVariables = []
  for (const record of response.data.data) {
    if (record.COLUMNNAME === null) continue;
    const mutationVariablesForRecord = expandObject(record, co_code, isconsolidated)
    mutationVariables = mutationVariables.concat(mutationVariablesForRecord)  
  }
  const tableName = (table['Table Name']);
  const insertMutation = `mutation ${tableName}_insert($objects: [${tableName}_insert_input!]!){
  insert_${tableName}(objects: $objects, on_conflict:{
    constraint: u_${tableName},
    update_columns: [value]
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

  persistData(inputJsonPath).then(r => console.log(r));
}
