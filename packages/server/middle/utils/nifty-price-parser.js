const fs = require('fs');
const { parse } = require('csv-parse');
const moment = require('moment');
const {postToGraphQL} = require('../lib/helper')

async function parseNiftyPricesCSV(filePath) {
    const records = [];
    
    const parsePromise = new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true,
                trim: true,
                bom: true,              // Handle UTF-8 BOM
                quote: '"',             // Specify quote character
                relax_quotes: true,     // Be more lenient with quotes
                relax_column_count: true // Allow varying column counts
            }))
            .on('data', (record) => {
                // Transform each record, ensuring we strip any remaining quotes
                const transformedRecord = {
                    price_date: moment(record.Date.replace(/"/g, ''), 'MM/DD/YYYY').format('YYYY-MM-DD'),
                    open: parseFloat(record.Open.replace(/"/g, '').replace(',', '')),
                    close: parseFloat(record.Close.replace(/"/g, '').replace(',', '')),
                    high: parseFloat(record.High.replace(/"/g, '').replace(',', '')),
                    low: parseFloat(record.Low.replace(/"/g, '').replace(',', '')),
                    volume_millions: parseFloat(record['Vol.'].replace(/"/g, '').replace('M', '')),
                    percentage_change: parseFloat(record['Change %'].replace(/"/g, '').replace('%', ''))
                };
                records.push(transformedRecord);
            })
            .on('end', () => {
                resolve(records);
            })
            .on('error', (error) => {
                reject(error);
            });
    });

    try {
        const parsedRecords = await parsePromise;
        return parsedRecords;
    } catch (error) {
        throw new Error(`Error parsing CSV: ${error.message}`);
    }
}
// Example usage
async function processNiftyPrices(filePath) {
    try {
        const records = await parseNiftyPricesCSV(filePath);
        
        const query = `
            mutation insertNiftyPrices($objects: [nse_nifty_prices_insert_input!]!) {
                insert_nse_nifty_prices(objects: $objects) {
                    affected_rows
                }
            }
        `;

        const variables = {
            objects: records
        };

        const result = await postToGraphQL({query, variables});
        return result;
    } catch (error) {
        throw new Error(`Error processing Nifty prices: ${error.message}`);
    }
}

module.exports = {
    parseNiftyPricesCSV,
    processNiftyPrices
};