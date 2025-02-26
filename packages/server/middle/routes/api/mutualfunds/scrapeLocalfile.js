const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');

// Path to your saved table HTML file
const tableFilePath = path.join(process.env.NSE_ANNOUNCEMENTS_DOWNLOAD, "indexFundsTable.html"); // Update this path

const parseTableFile = function() {
  try {
    // Read the HTML file containing just the table
    const tableContent = fs.readFileSync(tableFilePath, 'utf8');
    
    // Load table content into cheerio
    const $ = cheerio.load(tableContent);
    
    console.log("Table HTML loaded into cheerio");
    
    // Get all rows from the table body
    const rows = $('tbody tr');
    console.log(`Found ${rows.length} rows in the table body`);
    
    const records = [];
    
    rows.each((i, row) => {
      const cells = $(row).find('td');
      
      // Check if we have enough cells
      if (cells.length > 1) {
        const record = {};
        
        // Get fund name and URL from first cell
        const anchor = $(cells[0]).find('a');
        if (anchor.length > 0) {
          record["name"] = $(anchor).text().trim();
          const url = $(anchor).attr('href');
          record["url"] = url
          const urlParts = url.split('/');
          record["schemeCode"] = urlParts[urlParts.length - 1];
          // Fix relative URLs if needed
          if (record["url"] && !record["url"].startsWith('http')) {
            record["url"] = 'https://www.moneycontrol.com' + (record["url"].startsWith('/') ? '' : '/') + record["url"];
          }
        } else {
          record["name"] = $(cells[0]).text().trim();
        }
        
        // Get plan from second cell (which might be hidden in the HTML)
        record["plan"] = $(cells[1]).text().trim();
        
        // Add additional data if available
        if (cells.length > 2) record["category"] = $(cells[2]).text().trim();
        if (cells.length > 3) record["rating"] = $(cells[3]).text().trim();
        if (cells.length > 4) record["aum"] = $(cells[4]).text().trim();
        if (cells.length > 5) record["nav"] = $(cells[5]).text().trim();
        if (cells.length > 6) record["change_1d"] = $(cells[6]).text().trim();
        if (cells.length > 7) record["nav_date"] = $(cells[7]).text().trim();
        
        records.push(record);
      }
    });
    
    // Save the extracted records
    const outputPath = path.join(process.env.NSE_ANNOUNCEMENTS_DOWNLOAD || '.', "indexFunds.json");
    fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
    
    console.log(`Successfully extracted ${records.length} records and saved to ${outputPath}`);
    return records;
  } catch (error) {
    console.error("Error parsing table file:", error);
    return [];
  }
};

// Execute the function


// Execute the function
const route = async(req, res) => {
    parseTableFile()
    res.status(200).json("ok")
}
module.exports = route