const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function processCSV(csvFilePath, outputFolder) {
  try {
    // Read the CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf8');

    // Parse the CSV data
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      // Handle quoted fields properly
      trim: true,
      relax_quotes: true,
      relax_column_count: true
    });
    
    // Filter only the required columns
    const requiredColumns = [
      "ShortName", 
      "Series", 
      "CompanyName",
      "ISINCode",
      "Symbol", 
      "InstrumentType",
      "Name",
      "ExchangeCode"
    ];
    
    const filteredRecords = records.map(record => {
      const filteredRecord = {};
      requiredColumns.forEach(column => {
        // Only add the column if it exists in the record
        if (record[column] !== undefined) {
          filteredRecord[column] = record[column].trim();
        }
      });
      return filteredRecord;
    });
    
    console.log(`Processed ${filteredRecords.length} records`);
    
    // Make sure output directory exists
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }
    
    // Write the filtered records to a JSON file
    const outputPath = path.join(outputFolder, "icicidirectsymbols.json");
    fs.writeFileSync(outputPath, JSON.stringify(filteredRecords, null, 2));
    
    console.log(`JSON file successfully written to ${outputPath}`);
    
    return filteredRecords;
  } catch (error) {
    console.error('Error processing CSV file:', error.message);
    throw error;
  }
}

if (require.main === module) {
  const inputFile = process.argv[2];
  const outputFolder = process.argv[3] || './output';

  if (!inputFile) {
    console.error('Please provide an input CSV file path');
    process.exit(1);
  }

  processCSV(inputFile, outputFolder);
}

module.exports = { processCSV };