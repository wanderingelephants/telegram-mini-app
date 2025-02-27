const path = require("path")
const fs = require('fs');
const crypto = require('crypto')
const {postToGraphQL} = require("../../../lib/helper")

const xbrlParser = require('xbrl-parser');
const {mapping_category_of_insider, mapping_regulation, mapping_type_of_security, mapping_mode_of_transaction, 
  mapping_transaction_type, mapping_exchange,
  reverse_mapping_category_of_insider, reverse_mapping_regulation, reverse_mapping_type_of_security, reverse_mapping_mode_of_transaction, 
  reverse_mapping_transaction_type, reverse_mapping_exchange, 
  mapping_announcement_sentiment, reverse_mapping_announcement_sentiment, mapping_nse_segment, reverse_mapping_nse_segment} = require("./mappings")
const xrblFieldMappings = {
  'in-capmkt:RegulationOfInsiderTrading': 'mapping_regulation',
  'in-capmkt:CategoryOfPerson': 'mapping_category_of_insider',
  'in-capmkt:TypeOfInstrument': 'mapping_type_of_security'

}
const failedLogFile = "failed_records-" + (new Date()).toISOString()
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
  const num = parseFloat(value);
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
        number_of_securities_before_transaction: parseNumber(record['NO. OF SECURITY (PRIOR)']),
        number_of_securities_transacted: parseNumber(record['NO. OF SECURITIES (ACQUIRED/DISPLOSED)']),
        number_of_securities_after_transaction: parseNumber(record['NO. OF SECURITY (POST)']),
        value_of_securities_transacted: parseNumber(record['VALUE OF SECURITY (ACQUIRED/DISPLOSED)']),
        shareholding_before_transaction: parseNumber(record['% SHAREHOLDING (PRIOR)']),
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
//'in-capmkt:BSEScripCode'
//'in-capmkt:NSESymbol'
//'in-capmkt:NameOfThePerson'
//'in-capmkt:NameOfTheCompany'
/*
'in-capmkt:SecuritiesHeldPriorToAcquisitionOrDisposalNumberOfSecurity'
    'in-capmkt:SecuritiesHeldPriorToAcquisitionOrDisposalPercentageOfShareholding'
    'in-capmkt:SecuritiesAcquiredOrDisposedNumberOfSecurity'
    'in-capmkt:SecuritiesAcquiredOrDisposedValueOfSecurity'
    'in-capmkt:SecuritiesAcquiredOrDisposedTransactionType'
    'in-capmkt:SecuritiesHeldPostAcquistionOrDisposalNumberOfSecurity'
    'in-capmkt:SecuritiesHeldPostAcquistionOrDisposalPercentageOfShareholding'
    'in-capmkt:DateOfAllotmentAdviceOrAcquisitionOfSharesOrSaleOfSharesSpecifyFromDate'
    'in-capmkt:DateOfAllotmentAdviceOrAcquisitionOfSharesOrSaleOfSharesSpecifyToDate'
    'in-capmkt:DateOfIntimationToCompany'
    'in-capmkt:ModeOfAcquisitionOrDisposal'
    'in-capmkt:ExchangeOnWhichTheTradeWasExecuted'
    */

//const xmlData = fs.readFileSync(path.join(process.env.DATA_ROOT_FOLDER, "nse_insider_trades", "2025", "02", "25", "insider_trades", "xml", "IT_1178588_1389540_25022025113540_WEB.xml"), 'utf8');

//const result = xbrlParser.parseXbrlFile(xmlData)
//console.log(result)
//console.log(Object.keys(result))
//console.log(result['xbrli:xbrl']['in-capmkt:CategoryOfPerson'])



class InsiderTradesXrblParser {
  constructor() {

  }
  async persist(mutationData){
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
  async parse(xrblFilePath) {
    const xmlData = fs.readFileSync(xrblFilePath, 'utf8');
    const result = xbrlParser.parseXbrlFile(xmlData)
    const record = {}
    record["SYMBOL"] = result["xbrli:xbrl"]["in-capmkt:NSESymbol"]["#text"]
    record["COMPANY"] = result["xbrli:xbrl"]["in-capmkt:NameOfTheCompany"]["#text"]
    console.log(JSON.stringify(result["xbrli:xbrl"]["in-capmkt:NameOfThePerson"]))
    record["NAME OF THE ACQUIRER/DISPOSER"] = result["xbrli:xbrl"]["in-capmkt:NameOfThePerson"][0]["#text"]
    record["CATEGORY OF PERSON"] = result["xbrli:xbrl"]["in-capmkt:CategoryOfPerson"][0]["#text"]
    record["REGULATION"] = result["xbrli:xbrl"]["in-capmkt:RegulationOfInsiderTrading"]["#text"]
    record ["TYPE OF SECURITY (PRIOR)"] = result["xbrli:xbrl"]["in-capmkt:TypeOfInstrument"][0]["#text"]
    record["MODE OF ACQUISITION"] = result["xbrli:xbrl"]["in-capmkt:ModeOfAcquisitionOrDisposal"][0]["#text"]
    record["EXCHANGE"] = result["xbrli:xbrl"]["in-capmkt:ExchangeOnWhichTheTradeWasExecuted"][0]["#text"]
    record["ACQUISITION/DISPOSAL TRANSACTION TYPE"] = result["xbrli:xbrl"]["in-capmkt:SecuritiesAcquiredOrDisposedTransactionType"][0]["#text"]
    record["NO. OF SECURITY (PRIOR)"] = result["xbrli:xbrl"]["in-capmkt:SecuritiesHeldPriorToAcquisitionOrDisposalNumberOfSecurity"][0]["#text"]
    record["NO. OF SECURITIES (ACQUIRED/DISPLOSED)"] = result["xbrli:xbrl"]["in-capmkt:SecuritiesAcquiredOrDisposedNumberOfSecurity"][0]["#text"]
    record["NO. OF SECURITY (POST)"] = result["xbrli:xbrl"]["in-capmkt:SecuritiesHeldPostAcquistionOrDisposalNumberOfSecurity"][0]["#text"]

    record["VALUE OF SECURITY (ACQUIRED/DISPLOSED)"]=result["xbrli:xbrl"]["in-capmkt:SecuritiesAcquiredOrDisposedValueOfSecurity"][0]["#text"]
    record['% SHAREHOLDING (PRIOR)']=result["xbrli:xbrl"]["in-capmkt:SecuritiesHeldPriorToAcquisitionOrDisposalPercentageOfShareholding"][0]["#text"]
    record['% POST']=result["xbrli:xbrl"]["in-capmkt:SecuritiesHeldPostAcquistionOrDisposalPercentageOfShareholding"][0]["#text"]
    record['DATE OF ALLOTMENT/ACQUISITION FROM']=result["xbrli:xbrl"]["in-capmkt:DateOfAllotmentAdviceOrAcquisitionOfSharesOrSaleOfSharesSpecifyFromDate"][0]["#text"]
    record['DATE OF ALLOTMENT/ACQUISITION TO']=result["xbrli:xbrl"]["in-capmkt:DateOfAllotmentAdviceOrAcquisitionOfSharesOrSaleOfSharesSpecifyToDate"][0]["#text"]
    record['DATE OF INITMATION TO COMPANY']=result["xbrli:xbrl"]["in-capmkt:DateOfIntimationToCompany"][0]["#text"]

    console.log(record)
    let mutationObject
    try {
      mutationObject = transformToMutationObject(record);
      console.log(mutationObject)
      await this.persist(mutationObject);
     } catch (error) {
      console.error(error);
      console.log(JSON.stringify(mutationObject))
    }
  }
}
module.exports = InsiderTradesXrblParser