const NSEDataDownloader = require('./NSEDataDownloader'); // Assuming your module file is named nse_downloader.js

// Create an async function to run the test
async function runTest() {
    const downloader = new NSEDataDownloader();
    try {
        const csvData = await downloader.downloadETFData();
        console.log('Successfully downloaded CSV data:', csvData.substring(0, 200) + '...');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the test
runTest();