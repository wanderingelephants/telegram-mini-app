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
        "API_URL": record["API URL"],
        "API_URL_2": "", // Initialize empty, will be filled for special cases
        Frequency: record.Frequency,
        "Updation Time": record["Updation Time"],
        Interval: record.Interval,
        Columns: []
      };
      
      // Add API_URL as a column
      currentReport.Columns.push({
        "Column_Name": "API_URL",
        "DataType": "varchar(255)", // Assuming appropriate data type
        "Column Description": "Primary API URL"
      });
      
      // Add Input as a column
      currentReport.Columns.push({
        "Column_Name": "Input",
        "DataType": "varchar(100)", // Assuming appropriate data type
        "Column Description": record["Input Description"]
      });
      
      // Add the first column from the current row (Output/DataType/OutputDescription)
      currentReport.Columns.push({
        "Column_Name": record.Output,
        "DataType": record.DataType,
        "Column Description": record["Output Description"]
      });
    } 
    // Check for secondary API URL (mainly for Index Master)
    else if (currentReport && record["API URL"] && record["API URL"].trim() !== '') {
      // Store the secondary URL
      currentReport["API_URL_2"] = record["API URL"];
      
      // Add API_URL_2 as a column
      currentReport.Columns.push({
        "Column_Name": "API_URL_2",
        "DataType": "varchar(255)", // Assuming appropriate data type
        "Column Description": "Secondary API URL"
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

const inputFilePath = '/Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/api_doc_financials.csv';
const outputFilePath = '/Users/sachetsingh1/telegram-mini-app/packages/server/middle/cmots/reports_company_financials.json';


processCSVFile(inputFilePath, outputFilePath);

//module.exports = { parseCSVToJSON, processCSVFile };