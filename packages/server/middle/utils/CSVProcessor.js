const fs = require('fs');
const csv = require('csv-parse');

class CSVProcessor {
    constructor() {
        this.records = [];
    }

    /**
     * Process a CSV file and return parsed records
     * @param {string} filePath - Path to the CSV file
     * @returns {Promise<Array>} Array of parsed records
     */
    async processFile(filePath) {
        return new Promise((resolve, reject) => {
            const parser = csv.parse({
                columns: true,
                skip_empty_lines: true,
                cast: (value, context) => {
                    // Cast numeric values
                    if (!isNaN(value) && value !== '') {
                        return Number(value);
                    }
                    // Cast date values
                    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        return new Date(value);
                    }
                    return value;
                }
            });

            const records = [];

            parser.on('readable', () => {
                let record;
                while ((record = parser.read()) !== null) {
                    records.push(record);
                }
            });

            parser.on('error', (err) => {
                reject(err);
            });

            parser.on('end', () => {
                this.records = records;
                resolve(records);
            });

            fs.createReadStream(filePath).pipe(parser);
        });
    }

    /**
     * Process CSV content directly from a string
     * @param {string} content - CSV content as string
     * @returns {Promise<Array>} Array of parsed records
     */
    async processContent(content) {
        return new Promise((resolve, reject) => {
            csv.parse(content, {
                columns: true,
                skip_empty_lines: true,
                cast: (value, context) => {
                    // Cast numeric values
                    if (!isNaN(value) && value !== '') {
                        return Number(value);
                    }
                    // Cast date values
                    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        return new Date(value);
                    }
                    return value;
                }
            }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    this.records = records;
                    resolve(records);
                }
            });
        });
    }

    /**
     * Get all processed records
     * @returns {Array} Array of all processed records
     */
    getRecords() {
        return this.records;
    }

    /**
     * Get record by instrument token
     * @param {number} token - Instrument token to search for
     * @returns {Object|null} Matching record or null if not found
     */
    getRecordByInstrumentToken(token) {
        return this.records.find(record => record.instrument_token === token) || null;
    }
}

module.exports = CSVProcessor;