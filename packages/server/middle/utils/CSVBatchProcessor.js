/**
 * CSV Batch Processor
 * 
 * Downloads a CSV file from a URL and processes it in batches to avoid memory issues.
 * Stores the downloaded file in a date-based directory structure.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { parse } = require('csv-parse');
const { Transform } = require('stream');
const {DateTime} = require('luxon')

/**
 * Batch processor class for CSV files
 */
class CSVBatchProcessor {
  /**
   * Constructor for CSV Batch Processor
   * @param {Object} options - Configuration options
   * @param {number} options.batchSize - Number of records per batch (default: 2000)
   * @param {string} options.url - URL to download the CSV from (default: process.env.EOD_MARKET_QUOTES)
   * @param {string} options.storageDir - Base directory to store downloaded files (default: process.env.DATA_ROOT_FOLDER)
   * @param {string} options.timezone - Timezone to use for date calculations (default: 'Asia/Kolkata')
   */
  constructor(options = {}) {
    this.batchSize = options.batchSize || 20000;
    this.url = options.url || process.env.EOD_MARKET_QUOTES;
    this.storageDir = options.storageDir || process.env.DATA_ROOT_FOLDER;
    this.timezone = options.timezone || 'Asia/Kolkata';
    
    if (!this.url) {
      throw new Error('URL is required. Set process.env.EOD_MARKET_QUOTES or provide it in options.');
    }
    
    if (!this.storageDir) {
      throw new Error('Storage directory is required. Set process.env.DATA_ROOT_FOLDER or provide it in options.');
    }
  }

  /**
   * Get the destination path for the downloaded file based on current date in IST
   * @returns {Object} Object containing path and directory information
   */
  getDestinationPath() {
    const now = DateTime.now().setZone('Asia/Kolkata');
        const date = now.toFormat('yyyy-MM-dd');
        const [year, month, day] = date.split('-');
        
    
    const destDir = path.join(this.storageDir, year, month, day, 'eodrates');
    const destPath = path.join(destDir, 'market_quotes.csv');
    
    return { path: destPath, directory: destDir };
  }

  /**
   * Download the CSV file from the URL to the destination path
   * @returns {Promise<string>} Path to the downloaded file
   */
  async downloadFile() {
    const destination = this.getDestinationPath();
    
    try {
      // Create directory structure if it doesn't exist
      await fs.mkdirSync(destination.directory, {recursive: true});
      
      // Download the file
      const response = await axios({
        method: 'GET',
        url: this.url,
        responseType: 'stream'
      });
      
      // Save the file
      const writer = fs.createWriteStream(destination.path);
      response.data.pipe(writer);
      
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(destination.path));
        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Create a transform stream that batches records
   * @param {Function} processor - Function to process each batch
   * @returns {Transform} Transform stream
   */
  createBatchTransform(processor, sizeOfBatch) {
    let batch = [];
    
    return new Transform({
      objectMode: true,
      transform(record, encoding, callback) {
        batch.push(record);
        if (batch.length >= sizeOfBatch) {
          const currentBatch = [...batch];
          batch = [];
          
          // Process the batch asynchronously, but don't wait for it to complete
          processor(currentBatch)
            .then(() => callback())
            .catch(err => callback(err));
        } else {
          callback();
        }
      },
      flush(callback) {
        // Process the remaining records in the last batch
        if (batch.length > 0) {
          processor(batch)
            .then(() => callback())
            .catch(err => callback(err));
        } else {
          callback();
        }
      },
      batchSize: this.batchSize
    });
  }

  /**
   * Process the CSV file in batches
   * @param {Function} processor - Async function to process each batch of records
   * @returns {Promise<void>}
   */
  async processBatches(processor) {
    try {
      // Download the file first
      const filePath = await this.downloadFile();
      console.log(`File downloaded to: ${filePath}`);
      
      // Process the file in batches
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(parse({
            columns: true,  // Automatically detect columns from the header row
            skip_empty_lines: true
          }))
          .pipe(this.createBatchTransform(processor, this.batchSize))
          .on('error', reject)
          .on('finish', () => {
            console.log('CSV processing completed.');
            resolve();
          });
      });
    } catch (error) {
      throw new Error(`Failed to process CSV in batches: ${error.message}`);
    }
  }
}

/**
 * Default export - function to process a CSV file in batches
 * @param {Function} processor - Async function to process each batch of records
 * @param {Object} options - Options for the CSV batch processor
 */
module.exports = async function processCSVInBatches(processor, options = {}) {
  const batchProcessor = new CSVBatchProcessor(options);
  return batchProcessor.processBatches(processor);
};