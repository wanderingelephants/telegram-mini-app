const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
/**
 * Generate PostgreSQL and Hasura migration files from JSON schema
 * @param {string} inputJsonPath - Path to input JSON file
 * @param {string} migrationFolderPath - Path to output migration folder
 */
function generateMigration(inputJsonPath, migrationFolderPath, mutationFolderPath) {
  // Read and parse the JSON file
  const jsonData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
  // Create migration folder if it doesn't exist
  if (!fs.existsSync(migrationFolderPath)) {
    fs.mkdirSync(migrationFolderPath, { recursive: true });
  }

  if (!fs.existsSync(mutationFolderPath)) {
    fs.mkdirSync(mutationFolderPath, { recursive: true });
  }
  //fs.writeFileSync(path.join(mutationFolderPath, "mutations.js"), "")

  // Create SQL folder for migrations
  const sqlFolderPath = path.join(migrationFolderPath, 'migrations');
  if (!fs.existsSync(sqlFolderPath)) {
    fs.mkdirSync(sqlFolderPath, { recursive: true });
  }
  
  // Create metadata folder for Hasura
  const metadataFolderPath = path.join(migrationFolderPath, 'metadata');
  if (!fs.existsSync(metadataFolderPath)) {
    fs.mkdirSync(metadataFolderPath, { recursive: true });
  }
  
  // Create map of tables and their columns
  const tablesMap = {};
  let exportList = []
  // Process each table for SQL creation
  jsonData.forEach(table => {
    const tableName = (table['Table Name']);
    const isMasterTable = tableName === 'company_master';
    const columns = table.Columns;
    
    // Store table info for later relationship creation
    tablesMap[tableName] = {
      columns,
      isMasterTable
    };
    exportList.push(tableName+"_insert")
    // Generate SQL migration
    generateSqlMigration(sqlFolderPath, tableName, columns, isMasterTable);

    let insertMutation = `const ${tableName}_insert = \`mutation ${tableName}_insert($object: ${tableName}_insert_input!){
      insert_${tableName}_one(object: $object){
        id
      }
    }\`\nmodule.exports = ${tableName}_insert`
    fs.writeFileSync(path.join(mutationFolderPath, `mutation_${tableName}.js`), insertMutation)
  });
  
  // Generate consolidated Hasura metadata for all tables (appending to existing)
  appendTableMetadata(metadataFolderPath, tablesMap);
  
  console.log(`Migration files generated successfully in ${migrationFolderPath}`);
  //fs.appendFileSync(path.join(mutationFolderPath, "mutations.js"), `\nmodule.exports = {${exportList.join(', ')}}`)
}


function sleepSync(ms) {
    const start = Date.now();
    while (Date.now() - start < ms);
  }
/**
 * Generate SQL migration files for a table
 * @param {string} sqlFolderPath - Path to SQL folder
 * @param {string} tableName - Table name
 * @param {Array} columns - Table columns
 * @param {boolean} isMasterTable - Whether this is the master table
 */
function generateSqlMigration(sqlFolderPath, tableName, columns, isMasterTable) {
  const timestamp = new Date().getTime();
  const migrationFolder = path.join(sqlFolderPath, `${timestamp}_create_${tableName}`);
  
  if (!fs.existsSync(migrationFolder)) {
    fs.mkdirSync(migrationFolder, { recursive: true });
  }
  sleepSync(5)
  // Generate up.sql
  let createTableSql = `-- Create ${tableName} table\n`;
  createTableSql += `CREATE TABLE "${tableName}" (\n`;
  createTableSql += `  id SERIAL PRIMARY KEY,\n`;
  
  
  // Process columns
  let hasCoCode = false;
  let hasCmotsCode = false;
  let needsCoCode = false;
  let hasRecordDate = false;
  /*{
    "Column_Name": "Input",
    "DataType": "varchar(100)",
    "Column_Description": "CMOTS Company Code"
  },*/
  columns.forEach(column => {
    column.Column_Name = column.Column_Name.trim()
    column.Column_Name = column.Column_Name.toLowerCase()
    if (column.Column_Name === 'co_code') {
      hasCoCode = true;
    }
    if (column.Column_Name === 'cmotscode') {
      hasCmotsCode = true;
    }
    if (column.Column_Name === 'record_date') {
      hasRecordDate = true;
    }
    
    if (column.Column_Name.toLowerCase() === 'input' && 
        column.Column_Description && 
        column.Column_Description.toLowerCase().includes('cmots company code')) {
      needsCoCode = true;
    }
    
    if (column.Column_Name.toLowerCase() !== 'input' || !needsCoCode) {
      const pgType = convertToPgType(column.Column_DataType);
      createTableSql += `  "${column.Column_Name}" ${pgType} ${(isMasterTable && column.Column_Name==="co_code")? "unique":""},\n`;
    }
    //console.log(column, hasCoCode, needsCoCode)
  
  });
  
  // Add co_code column if needed
  if (needsCoCode && !hasCoCode) {
    createTableSql += `  "co_code" integer,\n`;
    hasCoCode = true;
  }
  
  // Add foreign key if needed
  if (!isMasterTable && hasCoCode) {
    createTableSql += `  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict\n`;
  } else if (!isMasterTable && hasCmotsCode){
    createTableSql += `  FOREIGN KEY ("cmotscode") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict\n`;
  } 
  else {
    // Remove the trailing comma
    createTableSql = createTableSql.slice(0, -2) + "\n";
  }
  if (hasCoCode && hasRecordDate){
    createTableSql += `, UNIQUE(co_code, record_date)`
  }
  createTableSql += `);\n`;
  if (!isMasterTable && hasCoCode) {
    //CREATE  INDEX "mf_aum_index" on  "public"."mutual_fund" using btree ("aum");
    createTableSql += `CREATE INDEX "${tableName}_co_code_index" on "public"."${tableName}" using btree ("co_code");\n`;
  }
  if (!isMasterTable && hasCmotsCode) {
    //CREATE  INDEX "mf_aum_index" on  "public"."mutual_fund" using btree ("aum");
    createTableSql += `CREATE INDEX "${tableName}_cmotscode_index" on "public"."${tableName}" using btree ("cmotscode");\n`;
  }
  if (hasRecordDate){
    createTableSql += `CREATE INDEX "${tableName}_record_date_index" on "public"."${tableName}" using btree ("record_date");\n`;
  }
  
  // Write up.sql
  fs.writeFileSync(path.join(migrationFolder, 'up.sql'), createTableSql);
  
  // Generate down.sql
  const dropTableSql = `-- Drop ${tableName} table\nDROP TABLE IF EXISTS "${tableName}";`;
  fs.writeFileSync(path.join(migrationFolder, 'down.sql'), dropTableSql);

  
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
  }else if (lowerType.startsWith('int')) {
    return 'integer';
  } else if (lowerType.startsWith('date')) {
    return 'date';
  }else if (lowerType.startsWith('boolean')) {
    return 'boolean';
  }
  
  // Default to text for unknown types
  return 'text';
}

/**
 * Read existing table metadata if it exists
 * @param {string} metadataFolderPath - Path to metadata folder
 * @return {Array} - Existing table metadata or empty array
 */
function readExistingTableMetadata(metadataFolderPath) {
  const tablesYamlPath = path.join(metadataFolderPath, 'tables.yaml');
  
  if (fs.existsSync(tablesYamlPath)) {
    try {
      return yaml.load(fs.readFileSync(tablesYamlPath, 'utf8')) || [];
    } catch (error) {
      console.warn(`Warning: Could not parse existing tables.yaml: ${error.message}`);
      return [];
    }
  }
  
  return [];
}

/**
 * Append new table metadata to existing metadata
 * @param {string} metadataFolderPath - Path to metadata folder
 * @param {Object} tablesMap - Map of all tables and their info
 */
function appendTableMetadata(metadataFolderPath, tablesMap) {
  // Read existing metadata
  const existingTablesMetadata = readExistingTableMetadata(metadataFolderPath);
  
  // Get existing table names to avoid duplicates
  const existingTableNames = new Set(
    existingTablesMetadata.map(tableData => 
      tableData.table && tableData.table.name ? tableData.table.name : null
    ).filter(Boolean)
  );
  
  // Create new metadata for tables that don't already exist
  const newTablesMetadata = [];
  
  Object.keys(tablesMap).forEach(tableName => {
    // Skip if table already exists in metadata
    if (existingTableNames.has(tableName)) {
      console.log(`Table ${tableName} already exists in metadata, skipping...`);
      return;
    }
    
    const tableInfo = tablesMap[tableName];
    const isMasterTable = tableInfo.isMasterTable;
    const columns = tableInfo.columns;
    
    const tableMetadata = {
      table: {
        name: tableName,
        schema: "public"
      }
    };
    
    // Add select permissions
    /*tableMetadata.select_permissions = [
      {
        role: "user",
        permission: {
          columns: ["id", ...columns.map(col => col.Column_Name)],
          filter: {},
          allow_aggregations: true
        }
      }
    ];*/
    
    // Check for relationships
    const hasCoCode = columns.some(col => col.Column_Name === 'co_code');
    const hasInputWithCMOTS = columns.some(col => 
      col.Column_Name.toLowerCase() === 'input' && 
      col.Column_Description && 
      col.Column_Description.toLowerCase().includes('cmots company code')
    );
    
    const objectRelationships = [];
    const arrayRelationships = [];
    
    
    if (!isMasterTable && (hasCoCode || hasInputWithCMOTS)) {
      // Add object relationship to company_master
      objectRelationships.push({
        name: "company_master",
        using: {
          foreign_key_constraint_on: "co_code"
        }
      });
    }
    
    // If this is the master table, add array relationships to all child tables
    if (isMasterTable) {
      Object.keys(tablesMap).forEach(childTableName => {
        if (childTableName === tableName) return; // Skip self
        
        const childTableInfo = tablesMap[childTableName];
        const childHasCoCode = childTableInfo.columns.some(col => col.Column_Name === 'co_code');
        const childHasInputWithCMOTS = childTableInfo.columns.some(col => 
          col.Column_Name.toLowerCase() === 'input' && 
          col.Column_Description && 
          col.Column_Description.toLowerCase().includes('cmots company code')
        );
        
        if (childHasCoCode || childHasInputWithCMOTS) {
          arrayRelationships.push({
            name: childTableName,
            using: {
              foreign_key_constraint_on: {
                column: "co_code",
                table: {
                  name: childTableName,
                  schema: "public"
                }
              }
            }
          });
        }
      });
    }
    
    // Add relationships to metadata if they exist
    if (objectRelationships.length > 0) {
      tableMetadata.object_relationships = objectRelationships;
    }
    
    if (arrayRelationships.length > 0) {
      tableMetadata.array_relationships = arrayRelationships;
    }
    
    // Add to new tables metadata
    newTablesMetadata.push(tableMetadata);
  });
  
  // Combine existing and new metadata
  const combinedTablesMetadata = [...existingTablesMetadata, ...newTablesMetadata];
  
  // Write combined tables metadata to YAML file
  const yamlContent = yaml.dump(combinedTablesMetadata, { indent: 2 });
  
  // Create backup of existing file if it exists
  const tablesYamlPath = path.join(metadataFolderPath, 'tables.yaml');
  if (fs.existsSync(tablesYamlPath)) {
    const backupPath = path.join(metadataFolderPath, `tables.yaml.backup.${Date.now()}`);
    fs.copyFileSync(tablesYamlPath, backupPath);
    console.log(`Created backup of existing tables.yaml at ${backupPath}`);
  }
  
  // Write the combined metadata
  fs.writeFileSync(tablesYamlPath, yamlContent);
  console.log(`Updated tables.yaml with ${newTablesMetadata.length} new tables`);
}

module.exports = { generateMigration };

// If this script is run directly
if (require.main === module) {
  if (process.argv.length < 4) {
    console.error('Usage: node script.js <input_json_path> <migration_folder_path>');
    process.exit(1);
  }
  
  const inputJsonPath = process.argv[2];
  const migrationFolderPath = process.argv[3];
  const mutationFolderPath = process.argv[4];
  
  generateMigration(inputJsonPath, migrationFolderPath, mutationFolderPath);
}