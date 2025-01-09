const fetchCSV = require('./csvFetcher');

// Example usage
fetchCSV('https://www.nseindia.com/api/corporate-announcements?index=sme&from_date=02-01-2025&to_date=03-01-2025', './downloads/data.csv')
    .then(() => console.log('CSV downloaded successfully'))
    .catch(err => console.error('Failed to download CSV:', err));