const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const abbreviateColumnName = require('./abbreviateColumnName');

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
  if (type.includes('datetime')) return 'date';

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

  let normalized = name.trim()
    .toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
  // Keep 'or' as is (for cases like "sales_or_income")

  normalized = normalized.toLowerCase().replace(/\s+/g, "_");
  normalized = normalized.replace(/_+/g, "_");

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

function processConstraints(currentTable) {
  const tableName = currentTable["Table Name"]
  const unique_columns = []
  const indexed_columns = []
  for (const ColumnDef of currentTable.Columns) {
    if (ColumnDef.Is_Unique && ColumnDef.Is_Unique.toLowerCase() === "true") unique_columns.push(ColumnDef.Column_Name)
    if (ColumnDef.Is_Index && ColumnDef.Is_Index.toLowerCase() === "true") indexed_columns.push(ColumnDef.Column_Name)
  }
  currentTable["UniqueColumns"] = unique_columns
  currentTable["Indexes"] = indexed_columns

  if (currentTable.Columns.filter(c => c.Column_Name === "index_code").length > 0) {
    if (tableName !== "company_index_master")
      currentTable.ForeignKeys.push({
        Column_Name: "index_code",
        References: { "Table_Name": "company_index_master", "Column_Name": "index_code" }
      })
  }
  if (currentTable.Columns.filter(c => c.Column_Name === "sect_code").length > 0) {
    if (tableName !== "company_sector_master")
      currentTable.ForeignKeys.push({
        Column_Name: "sect_code",
        References: { "Table_Name": "company_sector_master", "Column_Name": "sect_code" }
      })
  }
  if (currentTable.Columns.filter(c => c.Column_Name === "co_code").length > 0) {
    if (tableName !== "company_master")
      currentTable.ForeignKeys.push({
        Column_Name: "co_code",
        References: { "Table_Name": "company_master", "Column_Name": "co_code" }
      })
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
      let input = ""
      if (record.Input.toLowerCase() === "cocode" || record.Input.toLowerCase() === "co_code") input = "co_code"
      if (record.Input.toLowerCase() === "sectcode" || record.Input.toLowerCase() === "sect_code") input = "sect_code"
      if (record.Input.toLowerCase() === "indexcode" || record.Input.toLowerCase() === "index_code") input = "index_code"

      // Start a new table
      currentTable = {
        ReportIndex: parseInt(record.ReportIndex),
        "Table Name": generatenormalized(record["Report Name"]),
        "Table Description": (record["Report Name"]),
        API_URL: record["API URL"],
        Frequency: record.Frequency,
        "Updation Time": record["Updation Time"],
        Interval: record.Interval,
        Input: input,
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
      let desc = record.Column_Name
      desc = desc.replace(/\s+/g, " ");
      if (desc === "CMOTS Company Code") desc = "co_code"
      desc = abbreviateColumnName(desc)
      desc = desc.replace(/_+/g, "_");

      const abbreviated = desc//abbreviateColumnName(desc)
      // Add the column to the current table
      if (currentTable.Columns.findIndex(c => c.Column_Name === abbreviated) === -1)
        currentTable.Columns.push({
          Column_Name: abbreviated,
          Column_DataType: normalizeDataType(record.Column_DataType),
          Column_Description: desc,
          Is_Unique: record.Is_Unique,
          Is_Index: record.Is_Index
        });
      else console.log("Column already exists", abbreviated)
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
 * @param {string} outputFolder - Path to the output JSON file
 */
function convertCsvToJson(inputFile, outputFolder) {
  fs.mkdirSync(outputFolder, { recursive: true })
  try {
    const tables = processCSV(inputFile);
    for (const table of tables) {
      const outputFile = path.join(outputFolder, `${table["Table Name"]}.json`)
      fs.writeFileSync(outputFile, JSON.stringify([table], null, 2));
      //console.log(`Conversion completed successfully. Output written to ${outputFile}`);
    }

  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  const inputFile = process.argv[2];
  const outputFolder = process.argv[3] || 'output.json';

  if (!inputFile) {
    console.error('Please provide an input CSV file path');
    process.exit(1);
  }

  convertCsvToJson(inputFile, outputFolder);
}
