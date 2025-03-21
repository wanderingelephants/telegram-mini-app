const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
/**
 * Generate PostgreSQL and Hasura migration files from JSON schema
 * @param {string} inputJsonPath - Path to input JSON file
 * @param {string} migrationFolderPath - Path to output migration folder
 */
function generateMigration(inputJsonPath, migrationFolderPath) {
  // Read and parse the JSON file
  const jsonData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
  // Create migration folder if it doesn't exist
  if (!fs.existsSync(migrationFolderPath)) {
    fs.mkdirSync(migrationFolderPath, { recursive: true });
  }

  /*if (!fs.existsSync(mutationFolderPath)) {
    fs.mkdirSync(mutationFolderPath, { recursive: true });
  }*/
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
    generateSqlMigration(sqlFolderPath, table, columns, isMasterTable);

    /*let insertMutation = `const ${tableName}_insert = \`mutation ${tableName}_insert($object: ${tableName}_insert_input!){
      insert_${tableName}_one(object: $object){
        id
      }
    }\`\nmodule.exports = ${tableName}_insert`
    fs.writeFileSync(path.join(mutationFolderPath, `mutation_${tableName}.js`), insertMutation)*/
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
function generateSqlMigration(sqlFolderPath, table, columns, isMasterTable) {
  const tableName = (table['Table Name']);
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
  //let needsCoCode = false;
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
    
    //if (column.Column_Name.toLowerCase() !== 'input' || !needsCoCode) {
      const pgType = convertToPgType(column.Column_DataType);
      const notNullLabel = column.Column_Name.toLowerCase() === "co_code" || column.Column_Name.toLowerCase() === "sect_code" || column.Column_Name.toLowerCase() === "index_code"? " not null" : ""
      createTableSql += `  "${column.Column_Name}" ${pgType} ${notNullLabel},\n`;
    //}
    //console.log(column, hasCoCode, needsCoCode)
  
  });
  
  // Add co_code column if needed
  /*if (needsCoCode && !hasCoCode) {
    createTableSql += `  "co_code" integer,\n`;
    hasCoCode = true;
  }*/
  const lastIndex = createTableSql.lastIndexOf(",")
  createTableSql = createTableSql.substring(0, lastIndex)
  createTableSql += "\n"
  for (let i=0; i<table.ForeignKeys.length; i++){
    const fk = table.ForeignKeys[i]
    if (i < table.ForeignKeys.length) createTableSql += ","
    createTableSql += `  FOREIGN KEY ("${fk.Column_Name}") REFERENCES "${fk.References.Table_Name}" (${fk.References.Column_Name}) ON UPDATE restrict ON DELETE restrict`;
    
    createTableSql += "\n"
  }
  createTableSql += `);\n`;
  // TABLE CLAUSE ENDS

  // ADD UNIQUE CONSTRAINTS AND INDEXES AS ALTER TABLE NOW
  createTableSql += `ALTER TABLE "public"."${tableName}" add constraint "u_${tableName}" unique (${table.UniqueColumns.map(col => `"${col}"`).join(", ")});\n`;

  for (const idx of table.Indexes){
    createTableSql += `CREATE INDEX "idx_${tableName}_${idx}" on "public"."${tableName}" using btree ("${idx}");\n`;
  }

  // Add foreign key if needed
  /*if (!isMasterTable && hasCoCode) {
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
  if (tableName === "company_sector_wise_company")
    createTableSql += `,FOREIGN KEY ("sect_code") REFERENCES "company_sector_master" (sect_code) ON UPDATE restrict ON DELETE restrict\n`
  if (tableName === "company_index_wise_company")
    createTableSql += `,FOREIGN KEY ("index_code") REFERENCES "company_index_master" (index_code) ON UPDATE restrict ON DELETE restrict\n`
  createTableSql += `);\n`;

  if (tableName === "company_sector_wise_company"){
    const plkCol = "sect_code"
    createTableSql += `alter table "public"."${tableName}" add constraint "${tableName}_${plkCol}_co_code" unique ("${plkCol}", "co_code");`;
  }
  if (tableName === "company_index_wise_company"){
    const plkCol = "index_code"
    createTableSql += `alter table "public"."${tableName}" add constraint "${tableName}_index_code_cmotscode" unique ("${plkCol}", "cmotscode");`;
  }
  if (tableName === "company_annual_report_data_declaration_list"){
    createTableSql += `alter table "public"."company_annual_report_data_declaration_list" add constraint "company_annual_report_data_declaration_list_uniq" unique ("reporttype", "reportdate", "co_code");`
  }
  if (tableName === "company_result_data_declaration_list"){
    createTableSql += `alter table "public"."company_result_data_declaration_list" add constraint "company_result_data_declaration_list_reporttyperesultdatecocode" unique ("reporttype", "resultdate", "co_code");`
  }
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
  if (tableName === "company_sector_wise_company"){
    createTableSql += `CREATE INDEX "${tableName}_sect_code_index" on "public"."${tableName}" using btree ("sect_code");\n`;
  }
  if (tableName === "company_index_wise_company"){
    createTableSql += `CREATE INDEX "${tableName}_index_code_index" on "public"."${tableName}" using btree ("index_code");\n`;
  }
  if (tableName === "company_annual_report_data_declaration_list"){
    createTableSql += `CREATE INDEX "${tableName}_reportdate_index" on "public"."${tableName}" using btree ("reportdate");\n`;
    createTableSql += `CREATE INDEX "${tableName}_reporttype_index" on "public"."${tableName}" using btree ("reporttype");\n`;
  }
  if (tableName === "company_result_data_declaration_list"){
    createTableSql += `CREATE INDEX "${tableName}_resultdate_index" on "public"."${tableName}" using btree ("resultdate");\n`;
    createTableSql += `CREATE INDEX "${tableName}_reporttype_index" on "public"."${tableName}" using btree ("reporttype");\n`;
  }   */
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
    const isMasterTable = tableName.toLowerCase().endsWith("_master");
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
    const hasSectCode = columns.some(col => col.Column_Name === 'sect_code');
    const hasIndexCode = columns.some(col => col.Column_Name === 'index_code');
    
    
    const objectRelationships = [];
    const arrayRelationships = [];
    
    
    if (!isMasterTable && hasCoCode) {
      // Add object relationship to company_master
      objectRelationships.push({
        name: "company_master",
        using: {
          foreign_key_constraint_on: "co_code"
        }
      });
    }
    if (!isMasterTable && hasSectCode) {
      // Add object relationship to company_master
      objectRelationships.push({
        name: "company_sector_master",
        using: {
          foreign_key_constraint_on: "sect_code"
        }
      });
    }
    if (!isMasterTable && hasIndexCode) {
      // Add object relationship to company_master
      objectRelationships.push({
        name: "company_index_master",
        using: {
          foreign_key_constraint_on: "index_code"
        }
      });
    }
    
    // If this is the master table, add array relationships to all child tables
    if (tableName === "company_master") {
      Object.keys(tablesMap).forEach(childTableName => {
        if (childTableName === tableName) return; // Skip self
        
        const childTableInfo = tablesMap[childTableName];
        const childHasCoCode = childTableInfo.columns.some(col => col.Column_Name === 'co_code');
        
        if (childHasCoCode) {
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
    if (tableName === "company_sector_master") {
      Object.keys(tablesMap).forEach(childTableName => {
        if (childTableName === tableName) return; // Skip self
        
        const childTableInfo = tablesMap[childTableName];
        const childHasCoCode = childTableInfo.columns.some(col => col.Column_Name === 'sect_code');
        
        if (childHasCoCode) {
          arrayRelationships.push({
            name: childTableName,
            using: {
              foreign_key_constraint_on: {
                column: "sect_code",
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
    if (tableName === "company_index_master") {
      Object.keys(tablesMap).forEach(childTableName => {
        if (childTableName === tableName) return; // Skip self
        
        const childTableInfo = tablesMap[childTableName];
        const childHasCoCode = childTableInfo.columns.some(col => col.Column_Name === 'index_code');
        
        if (childHasCoCode) {
          arrayRelationships.push({
            name: childTableName,
            using: {
              foreign_key_constraint_on: {
                column: "index_code",
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
  //const mutationFolderPath = process.argv[4];
  
  generateMigration(inputJsonPath, migrationFolderPath);
}