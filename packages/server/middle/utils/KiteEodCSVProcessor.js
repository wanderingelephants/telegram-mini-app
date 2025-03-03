/**
 * Example usage of the CSV Batch Processor
 */
const processCSVInBatches = require('./CSVBatchProcessor');

// Define a processor function that will be called for each batch
const dummyProcessor = async (records) => {
  console.log(`Processing batch of ${records.length} records`);
  console.log('First 2 records of this batch:');
  console.log(JSON.stringify(records.slice(0, 2), null, 2));
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log('Batch processing complete\n');
};

// Process the CSV file in batches of 2000 records (default)
console.log('Starting CSV batch processing...');

processCSVInBatches(dummyProcessor, {url: "https://api.kite.trade/instruments"})
  .then(() => console.log('All batches processed successfully'))
  .catch(err => console.error('Error processing CSV:', err));