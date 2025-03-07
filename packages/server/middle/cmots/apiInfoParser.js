const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * Parses a CSV file exported from Excel containing report data
 * and converts it to a structured JSON array
 * @param {string} csvFilePath - Path to the CSV file
 * @returns {Array} - Array of report objects
 */
function parseCSVToJSON(csvFilePath) {
  // Read the CSV file
  const csvContent = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parse the CSV content
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });
  
  const output = [];
  let currentReport = null;
  
  // Process each record
  for (const record of records) {
    // Check if this is a new report (has a ReportIndex)
    if (record.ReportIndex && record.ReportIndex.trim() !== '') {
      // If we have a previous report, add it to the output
      if (currentReport) {
        output.push(currentReport);
      }
      
      // Start a new report
      currentReport = {
        ReportIndex: parseInt(record.ReportIndex),
        "Report Name": record["Report Name"],
        "API URL": record["API URL"],
        Frequency: record.Frequency,
        "Updation Time": record["Updation Time"],
        Interval: record.Interval,
        Input: record.Input,
        "Input Description": record["Input Description"],
        Columns: []
      };
      
      // Add the first column from the current row
      currentReport.Columns.push({
        "Column_Name": record.Output,
        "DataType": record.DataType,
        "Column Description": record["Output Description"]
      });
    } 
    // This is a continuation of the current report (additional columns)
    else if (currentReport && record.Output && record.Output.trim() !== '') {
      currentReport.Columns.push({
        "Column_Name": record.Output,
        "DataType": record.DataType,
        "Column Description": record["Output Description"]
      });
    }
  }
  
  // Add the last report if it exists
  if (currentReport) {
    output.push(currentReport);
  }
  
  return output;
}

/**
 * Process CSV file and write the output to a JSON file
 */
function processCSVFile(inputFilePath, outputFilePath) {
  try {
    const jsonOutput = parseCSVToJSON(inputFilePath);
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonOutput, null, 2));
    console.log(`Successfully converted CSV to JSON. Output saved to ${outputFilePath}`);
    return jsonOutput;
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw error;
  }
}

/**
 * Handle the special case for record with ReportIndex 4 (Index Master)
 * which has two API URLs
 */
function handleSpecialCases(jsonOutput) {
  // Find Index Master record (ReportIndex: 4)
  const indexMasterRecord = jsonOutput.find(record => record.ReportIndex === 4);
  
  if (indexMasterRecord) {
    // Check if there's a second URL in the records
    const secondUrl = records.find(record => 
      !record.ReportIndex && 
      record["API URL"] && 
      record["API URL"].includes("Index-master/BSE")
    );
    
    if (secondUrl) {
      // Add the second URL to the API URL field
      indexMasterRecord["API URL"] = [
        indexMasterRecord["API URL"],
        secondUrl["API URL"]
      ];
    }
  }
  
  return jsonOutput;
}

//const inputFilePath = '/Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/api_doc_master_data.csv';
//const outputFilePath = '/Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/reports_master.json';

const inputFilePath = '/Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/api_doc_financials.csv';
const outputFilePath = '/Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/reports_company_financials.json';

processCSVFile(inputFilePath, outputFilePath);

// If you want to use this as a module
//module.exports = { parseCSVToJSON, processCSVFile };