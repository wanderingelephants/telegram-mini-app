const fs = require('fs');
const { parse } = require('csv-parse/sync');
const axios = require('axios');
const path = require('path');
const abbreviateColumnName = require("./abbreviateColumnName")

// Function to clean column names for PostgreSQL
function cleanName(name) {
  return name.trim()
  .toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
}

// Function to extract column names from API response
function extractColumnNames(data) {
  if (!Array.isArray(data)) {
    console.warn('API response is not an array');
    return [];
  }

  const columns = [];
  const columnDescs = {};
  
  data.forEach(item => {
    
    if (item.COLUMNNAME){
      //console.log("scema from api", item.COLUMNNAME)
      const abbreviated = abbreviateColumnName(item.COLUMNNAME)
      if (columns.indexOf(abbreviated) === -1){
        columns.push(abbreviated);
        columnDescs[abbreviated] = item.COLUMNNAME.trim();
      }
    }
    /*if (item.COLUMNNAME && columns.indexOf(abbreviateColumnName(item.COLUMNNAME)) === -1) {
      const cleanedName = abbreviateColumnName(item.COLUMNNAME);
      columns.push(cleanedName);
      columnDescs[cleanedName] = item.COLUMNNAME.trim(); // Store original name for description
    }*/
  });

  return { columns, columnDescs };
}

// Default columns to add to every table
const defaultColumns = [
  {
    "Column_Name": "created_at",
    "Column_DataType": "timestamptz",
    "Column_Description": "created timestamp",
    
  },
  {
    "Column_Name": "updated_at",
    "Column_DataType": "timestamptz",
    "Column_Description": "updated timestamp",
    
  },
  {
    "Column_Name": "co_code",
    "Column_DataType": "int",
    "Column_Description": "CMOTS Company Code",
    
  },
  {
    "Column_Name": "month",
    "Column_DataType": "int",
    "Column_Description": "Month",
    
  },
  {
    "Column_Name": "quarter",
    "Column_DataType": "int",
    "Column_Description": "Quarter",
  },
  {
    "Column_Name": "year",
    "Column_DataType": "int",
    "Column_Description": "Year",
  }
];

// Main function to process CSV and generate schema
async function generateSchemas(csvFilePath, outputDir) {
  try {
    // Read and parse CSV file
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const token = process.env.cmots_api_token;
    if (!token) {
      throw new Error('API token not found. Set the cmots_api_token environment variable.');
    }

    const axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Process each record in the CSV
    for (const record of records) {
        const reportIndex = parseInt(record.ReportIndex);
      const reportName = record['Report Name'];
      const apiUrl = record["API URL"];
      
      // Generate table name
      const tableName = `company_${cleanName(reportName)}`;
      
      console.log(`Processing ${reportName} ${apiUrl} (${reportIndex})...`);
      
      try {
        // Fetch data from API
        const apiResponse = await axios.get(apiUrl, axiosConfig);
        const sortedByRowNum = apiResponse.data.data.sort((a, b) => a.rowno - b.rowno)
        // Extract column names and descriptions
        const { columns, columnDescs } = extractColumnNames(sortedByRowNum);
        
        // Create second API URL (from S to C)
        const apiUrl2 = apiUrl.replace('/S', '/C');
        
        // Build the schema object
        const schema = {
          ReportIndex: reportIndex,
          "Table Name": tableName,
          "Table Description": reportName,
          "PromptQL": "Enterprise",
          Input: "co_code",
          API_URL: apiUrl,
          API_URL_2: apiUrl2,
          Frequency: record.Frequency,
          "Updation Time": record["Updation Time"],
          Interval: record.Interval,
          Columns: [
            ...columns.map(col => ({
              Column_Name: col,
              Column_DataType: "numeric",
              Column_Description: columnDescs[col] || col
            })),
            ...defaultColumns
          ],
          UniqueColumns: ["co_code", "month", "quarter", "year"],
          UniqueConstraintName: `${tableName}_co_code_mqy`,
          ForeignKeys: [{
            "Column_Name": "co_code",
            "References": {
              "Table_Name": "company_master",
              "Column_Name": "co_code"
            }
          }],//{Column_Name: "", References: {Table_Name: "", Column_Name: ""}}
          Indexes: ["co_code", "month", "quarter", "year"]
        };
        
        // Write schema to a JSON file
        const outputFile = path.join(outputDir, `${tableName}.json`);
        fs.writeFileSync(outputFile, JSON.stringify([schema], null, 2));
        //console.log(`Schema saved to ${outputFile}`);
      } catch (error) {
        console.error(`Error processing ${reportName} (${reportIndex}):`, error.message);
      }
    }
    
    console.log('All schemas generated successfully!');
  } catch (error) {
    console.error('Error generating schemas:', error.message);
  }
}

// Export the main function
module.exports = { generateSchemas };

// If run directly from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node index.js <csv-file-path> <output-directory>');
    process.exit(1);
  }
  
  generateSchemas(args[0], args[1]);
}