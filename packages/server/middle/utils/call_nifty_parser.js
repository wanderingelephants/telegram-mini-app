const { processNiftyPrices } = require('./nifty-price-parser');

// Process the file
processNiftyPrices(process.env.NSE_ANNOUNCEMENTS_DOWNLOAD + "/nifty_50_2024-10-01_2025-02-19.csv")
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Error:', error));