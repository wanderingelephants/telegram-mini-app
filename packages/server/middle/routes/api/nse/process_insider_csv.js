const fs = require('fs');
const crypto = require('crypto')
const csv = require('csv-parse');
const {postToGraphQL} = require("../../../lib/helper")
const Puppet = require('./puppet.js')
const downloadFolder = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD
const path = require("path")

let failedLogFile = "failed_records-" + (new Date()).toISOString();
// Lookup mappings for various columns
const {mapping_category_of_insider, mapping_regulation, mapping_type_of_security, mapping_mode_of_transaction, mapping_transaction_type, mapping_exchange} = require("./mappings")

// Clean header by removing newlines, extra spaces, and UTF-8 BOM
const cleanHeader = (header) => {
  return header
    .replace(/^\uFEFF/, '') // Remove BOM if present
    .replace(/\r?\n/g, '') // Remove newlines
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

// Log failed record to file
const logFailedRecord = (record, reason) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${reason}\nRecord: ${JSON.stringify(record, null, 2)}\n\n`;
  fs.appendFileSync(failedLogFile, logEntry);
};

// Validate lookup value exists
const validateLookup = (value, mapping, fieldName) => {
  if (mapping[value] === undefined) {
    throw new Error(`No mapping found for value "${value}" in ${fieldName}`);
  }
  return mapping[value];
};
const parseNumber = (value) => {
  if (typeof value !== 'string') return isNaN(value) ? 0 : value;
  const num = parseFloat(value.replace(/,/g, ''));
  return isNaN(num) ? 0 : num;
};
// Transform CSV data to mutation object
const transformToMutationObject = (record) => {
  try {
    // Validate all lookups first
    const categoryId = validateLookup(
      record['CATEGORY OF PERSON'],
      mapping_category_of_insider,
      'category_of_insider'
    );
    
    const regulationId = validateLookup(
      record['REGULATION'],
      mapping_regulation,
      'regulation'
    );
    
    const typeOfSecurityId = validateLookup(
      record['TYPE OF SECURITY (PRIOR)'],
      mapping_type_of_security,
      'type_of_security'
    );
    
    const modeOfTransactionId = validateLookup(
      record['MODE OF ACQUISITION'],
      mapping_mode_of_transaction,
      'mode_of_transaction'
    );
    
    const exchangeId = validateLookup(
      record['EXCHANGE'],
      mapping_exchange,
      'exchange'
    );
    const transactionTypeId = validateLookup(
        record['ACQUISITION/DISPOSAL TRANSACTION TYPE'],
        mapping_transaction_type,
        'transaction_type'
    );
    // Create stock data object
    const stockData = {
      symbol: record['SYMBOL'].toLowerCase(),
      company_name: record['COMPANY']
    };

    // Create main mutation object
    const mutationObject = {
      object: {
        stock: {
          data: stockData,
          on_conflict: {
            constraint: "stock_symbol_key",
            update_columns: ["company_name"]
          }
        },
        regulation_reference_id: regulationId,
        name_of_insider: record['NAME OF THE ACQUIRER/DISPOSER'],
        category_of_insider: categoryId,
        type_of_security: typeOfSecurityId,
        transaction_type: transactionTypeId,//record['ACQUISITION/DISPOSAL TRANSACTION TYPE'].toLowerCase() === "buy" ? true:false,
        mode_of_transaction: modeOfTransactionId,
        number_of_securities_before_transaction: parseNumber(record['NO. OF SECURITY (PRIOR)'].replace(/,/g, '')),
        number_of_securities_transacted: parseNumber(record['NO. OF SECURITIES (ACQUIRED/DISPLOSED)'].replace(/,/g, '')),
        number_of_securities_after_transaction: parseNumber(record['NO. OF SECURITY (POST)'].replace(/,/g, '')),
        value_of_securities_transacted: parseNumber(record['VALUE OF SECURITY (ACQUIRED/DISPLOSED)'].replace(/,/g, '')),
        shareholding_before_transaction : parseNumber(record['% SHAREHOLDING (PRIOR)']),
        shareholding_after_transaction: parseNumber(record['% POST']),
        transaction_date: record['DATE OF ALLOTMENT/ACQUISITION FROM'],
        intimation_date: record['DATE OF INITMATION TO COMPANY'],
        exchange: exchangeId 
      }
    };
    const hash = crypto.createHash('md5').update(JSON.stringify(mutationObject)).digest('hex'); //instead of having a unique composite key comprising all columns, just hash the whole object, and have unique key on the hash 
    mutationObject.object.hash = hash
    return mutationObject;
  } catch (error) {
    // Log the failed record and rethrow the error
    logFailedRecord(record, error.message);
    throw error;
  }
};

// Preprocess the CSV file to extract and clean headers
const preprocessCSV = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');
  
  // Find where the header ends
  let headerLines = [];
  let dataStartIndex = 0;
  let openQuotes = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const quoteCount = (line.match(/"/g) || []).length;
    
    if (quoteCount % 2 !== 0) {
      openQuotes = !openQuotes;
    }
    
    headerLines.push(line);
    
    if (!openQuotes && headerLines.length > 0) {
      dataStartIndex = i + 1;
      break;
    }
  }
  
  // Join and clean the header lines
  let headerRow = headerLines.join('');
  headerRow = headerRow.trim()
  if (headerRow.startsWith('"')) headerRow = headerRow.substring(1, headerRow.length)
  // First remove the very first and last quotes of the entire row
  const trimmedHeaderRow = headerRow.replace(/^"|"$/g, '');
  
  // Then split and clean each header
  const headers = trimmedHeaderRow
    .split('","')
    .map(h => cleanHeader(h));
  
  // Get the remaining data rows
  const dataRows = lines.slice(dataStartIndex).join('\n');
  
  return {
    headers,
    dataContent: dataRows
  };
};
const persist = async(mutationData) => {
    await postToGraphQL({
        "query": `mutation InsertInsiderTrade($object: insider_trades_insert_input!) {
  insert_insider_trades_one(
    object: $object
  ) {
    id
    name_of_insider
    category_of_insider
    type_of_security
    number_of_securities_before_transaction
    stock {
      id
      symbol
      company_name
    }
  }
}`,
        "variables": mutationData
    })
}
//dateStr 15-02-2025
const processInsiderCSV = async (dateStr, download = true) => {
    failedLogFile = "failed_records-" + (new Date()).toISOString()
  try {
    const fileName = dateStr + "_insider_trades.csv"
    console.log(downloadFolder, fileName)
    const filePath = path.join(downloadFolder, fileName)
    const baseUrl = "https://www.nseindia.com"
    const urlSuffix = `/api/corporates-pit?index=equities&from_date=${dateStr}&to_date=${dateStr}&csv=true`
    if (download === true){
      const puppet = new Puppet(baseUrl, urlSuffix, downloadFolder, fileName)
      await puppet.downloadFile()
    }
            
    // First preprocess to get clean headers and data
    const { headers, dataContent } = preprocessCSV(filePath);
    // Now parse the data with the clean headers
    csv.parse(dataContent, {
      columns: headers,
      skip_empty_lines: true,
      trim: true
    }, async (err, records) => {
      if (err) {
        console.error('Error parsing CSV data:', err);
        return;
      }

      // Process each record
      for (const [index, record] of records.entries()) {
        let mutationObject
        try {
          mutationObject = transformToMutationObject(record);
          await persist(mutationObject);
          //console.log(`\n--- Mutation Object for Record ${index + 1} ---`);
          //console.log(JSON.stringify(mutationObject, null, 2));
        } catch (error) {
          console.error(`Error processing record ${index + 1}:`, error.message);
          console.log(JSON.stringify(mutationObject))
        }
      }
    });
  } catch (error) {
    console.error('Error processing file:', error);
   
  }
};
const route = async(req, res) => {
  try{
    let download = "true" === req.query.download ? true : false
    await processInsiderCSV(req.query.dateStr, download) 
    res.status(200).json("ProcessedInsider")
  }
  catch(e){
    console.error(e)
    res.status(500).json(e)
  }
 
}
module.exports = route

//processInsiderCSV("17-02-2025", false)
