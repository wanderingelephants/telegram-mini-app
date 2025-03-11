const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function persistData(inputJsonPath) {
  // Read and parse the JSON file
  const jsonData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
  // Create migration folder if it doesn't exist
  
  jsonData.forEach(table => {
    const tableName = (table['Table Name']);
    const columns = table.Columns;
    columns.forEach(column => {
      column.Column_Name = column.Column_Name.trim()
      column.Column_Name = column.Column_Name.toLowerCase()
      const pgType = convertToPgType(column.Column_DataType);
      column.pgDataType = pgType      
    });
    console.log(tableName, columns)
    //const insertMutation = require("")
  });
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

module.exports = { persistData };

// If this script is run directly
if (require.main === module) {
  if (process.argv.length < 4) {
    console.error('Usage: node script.js <input_json_path> <migration_folder_path>');
    process.exit(1);
  }
  
  const inputJsonPath = process.argv[2];
  const migrationFolderPath = process.argv[3];
  const mutationFolderPath = process.argv[4];
  
  persistData(inputJsonPath);
}