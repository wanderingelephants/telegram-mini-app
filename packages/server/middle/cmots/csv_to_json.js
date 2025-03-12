const fs = require('fs');
const { parse } = require('csv-parse/sync');

/**
 * Normalize PostgreSQL compatible data type
 * @param {string} dataType - The original data type
 * @return {string} - The normalized PostgreSQL data type
 */
function normalizeDataType(dataType) {
  if (!dataType) return 'text';

  // Convert to lowercase for consistent comparison
  const type = dataType.toLowerCase();

  // Handle specific mappings according to requirements
  if (type === 'int' || type.includes('integer')) return 'integer';
  if (type === 'float' || type.includes('number') || type.includes('decimal')) return 'numeric';
  if (type.includes('varchar') || type.includes('char')) return 'text';
  if (type.includes('timestamp')) return 'timestamptz';
  if (type.includes('date')) return 'date';

  // Default to text for unrecognized types
  return 'text';
}

/**
 * Normalize name to PostgreSQL friendly format
 * @param {string} name - The original name
 * @return {string} - The normalized PostgreSQL friendly name
 */
function normalizeName(name) {
  if (!name) return '';
  name = name.trim()
  // Convert to lowercase
  let normalized = name.toLowerCase();

  normalized = normalized.trim()
  normalized = normalized.replaceAll(",", "")
  normalized = normalized.replaceAll(":", "")
  normalized = normalized.replaceAll("%", "_percent")
  normalized = normalized.replaceAll("'", "")
  normalized = normalized.replaceAll("’", "")
  normalized = normalized.replaceAll("(", "")
  normalized = normalized.replaceAll(")", "")
  normalized = normalized.replaceAll("/", "_")
  normalized = normalized.replaceAll("&", "and")
  // Replace special characters with underscores
  normalized = normalized.replace(/[&'"/]/g, '_');

  // Replace spaces with underscores
  normalized = normalized.replace(/\s+/g, '_');

  // Handle column named "date" specifically
  if (normalized === 'date') {
    return 'record_date';
  }

  return normalized;
}

/**
 * Generate table name from report name
 * @param {string} reportName - The original report name
 * @return {string} - The normalized table name
 */
function generatenormalized(reportName) {
  if (!reportName) return '';

  const normalized = normalizeName(reportName)
  // Normalize and prefix with "company_" as in the example
  return normalized.startsWith("company") ? normalized : "company_" + normalized
}

function processConstraints(currentTable){
  const tableName = currentTable["Table Name"]
        console.log("adding table to array", currentTable.ReportIndex, tableName)
        //Unique constraints
        if (tableName === "company_master") currentTable["UniqueColumns"].push("co_code")
        if (tableName === "company_sector_master") currentTable["UniqueColumns"].push("sect_code")
        if (tableName === "company_index_master") currentTable["UniqueColumns"].push("index_code")

        if (tableName === "company_sector_wise_company") {
          currentTable["UniqueColumns"].push("sect_code")
          
        }
        if (tableName === "company_index_wise_company") {
          currentTable["UniqueColumns"].push("index_code")
          
        }
        if (tableName === "company_annual_report_data_declaration_list") {
          currentTable["UniqueColumns"].push("reporttype")
          currentTable["UniqueColumns"].push("reportdate")
          
        }
        if (tableName === "company_result_data_declaration_list") {
          currentTable["UniqueColumns"].push("reporttype")
          currentTable["UniqueColumns"].push("resultdate")
          
        }
        if (tableName === "company_exchange_holidays") {
          currentTable["UniqueColumns"].push("holidaydate")
        }
        if (tableName === "company_results_today") {
          
          currentTable["UniqueColumns"].push("resultdate")
        }
        if (tableName === "company_trailing_todate_ratios"){
          
          currentTable["UniqueColumns"].push("record_date")
        }
        if (currentTable.Columns.filter(c => c.Column_Name.toLowerCase() === "yrc").length > 0){
          currentTable["UniqueColumns"].push("yrc")
        }
        if (tableName !== "company_master" && currentTable.Columns.filter(c => c.Column_Name.toLowerCase() === "co_code").length > 0){
          currentTable["UniqueColumns"].push("co_code")
        }
        let uniqueConstraintName = `${currentTable["Table Name"]}_${currentTable["UniqueColumns"].join("_")}`
        if (uniqueConstraintName.length > 63) uniqueConstraintName = uniqueConstraintName.substring(0, 62)
        currentTable.UniqueConstraintName = uniqueConstraintName

        //Foreign Keys
        if (!tableName.endsWith("_master")){
          console.log("Process FKs for", tableName)
          if (currentTable.Columns.filter(c => c.Column_Name === "co_code").length > 0){
            currentTable.ForeignKeys.push({
              Column_Name: "co_code", 
              References: {"Table_Name": "company_master", "Column_Name": "co_code"}
            })
          }
          if (tableName === "company_sector_wise_company") {
            currentTable.ForeignKeys.push({
              Column_Name: "sect_code", 
              References: {"Table_Name": "company_sector_master", "Column_Name": "sect_code"}
            })
          }
          if (tableName === "company_index_wise_company") {
            currentTable.ForeignKeys.push({
              Column_Name: "index_code", 
              References: {"Table_Name": "company_index_master", "Column_Name": "index_code"}
            })
          }
        }

        //Indexes
        
        for (const fk of currentTable.ForeignKeys){
          currentTable.Indexes.push(fk.Column_Name)
        }
        for (const col of currentTable.Columns){
          if (col.Column_Name.toLowerCase().endsWith("date")){
            currentTable.Indexes.push(col.Column_Name)
          }
        }
        
        if (tableName === "company_annual_report_data_declaration_list") {
          currentTable["Indexes"].push("reporttype")
          
        }
        if (tableName === "company_result_data_declaration_list") {
          currentTable["Indexes"].push("reporttype")
          
        }
}
/**
 * Process CSV data and convert to PostgreSQL schema JSON
 * @param {string} csvFilePath - Path to the CSV file
 * @return {Array} - Array of table definitions
 */

function processCSV(csvFilePath) {
  // Read the CSV file
  const csvData = fs.readFileSync(csvFilePath, 'utf8');

  // Parse the CSV data
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  const tables = [];
  let currentTable = null;

  for (const record of records) {
    // Check if this is a table definition row (has ReportIndex)
    if (record.ReportIndex && record.ReportIndex.trim() !== '') {

      if (currentTable) {
        processConstraints(currentTable)
        tables.push(currentTable);
      }

      // Start a new table
      currentTable = {
        ReportIndex: parseInt(record.ReportIndex),
        "Table Name": generatenormalized(record["Report Name"]),
        API_URL: record["API URL"],
        Frequency: record.Frequency,
        "Updation Time": record["Updation Time"],
        Interval: record.Interval,
        Input: record.Input,
        "Input Description": record["Input Description"],
        Columns: [],
        UniqueColumns: [],
        UniqueConstraintName: "",
        ForeignKeys: [],//{Column_Name: "", References: {Table_Name: "", Column_Name: ""}}
        Indexes: []
      };
      currentTable.Columns.push({
        Column_Name: "created_at",
        Column_DataType: "timestamp",
        Column_Description: "created time"
      });
      currentTable.Columns.push({
        Column_Name: "updated_at",
        Column_DataType: "timestamp",
        Column_Description: "updated time"
      });
    }
    // Check if this is a column definition row
    else if (currentTable && record.Column_Name && record.Column_Name.trim() !== '' &&
      record.Column_Name.toLowerCase() !== 'output') {
      // Add the column to the current table
      currentTable.Columns.push({
        Column_Name: normalizeName(record.Column_Name),
        Column_DataType: normalizeDataType(record.Column_DataType),
        Column_Description: record.Column_Description
      });
    }
  }

  // Add the last table if it exists
  if (currentTable) {
    processConstraints(currentTable)
    tables.push(currentTable);
  }

  return tables;
}

/**
 * Main function to convert CSV to JSON
 * @param {string} inputFile - Path to the input CSV file
 * @param {string} outputFile - Path to the output JSON file
 */
function convertCsvToJson(inputFile, outputFile) {
  try {
    const tables = processCSV(inputFile);
    fs.writeFileSync(outputFile, JSON.stringify(tables, null, 2));
    console.log(`Conversion completed successfully. Output written to ${outputFile}`);
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3] || 'output.json';

  if (!inputFile) {
    console.error('Please provide an input CSV file path');
    process.exit(1);
  }

  convertCsvToJson(inputFile, outputFile);
}
