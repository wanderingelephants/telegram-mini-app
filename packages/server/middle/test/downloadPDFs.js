const fetchPDF = require('./pdfFetcher');

// Array of PDF URLs and their corresponding save paths
const downloads = [
    {
        url: 'https://nsearchives.nseindia.com/corporate/SURANI_03012025213042_SSTLallotment03012025.pdf',
        path: './downloads/surani.pdf'
    },
    {
        url: 'https://nsearchives.nseindia.com/corporate/SPEL_03012025172906_GeneralUpdate.pdf',
        path: './downloads/spel.pdf'
    }
    // Add more URLs and paths as needed
];

// Function to ensure download directory exists
const fs = require('fs');
const path = require('path');
const downloadDir = path.join(__dirname, 'downloads');

if (!fs.existsSync(downloadDir)){
    fs.mkdirSync(downloadDir, { recursive: true });
}

// Function to download all PDFs
async function downloadAllPDFs() {
    console.log('Starting downloads...');
    
    for (const [index, download] of downloads.entries()) {
        try {
            console.log(`\nDownloading PDF ${index + 1}/${downloads.length}`);
            console.log(`URL: ${download.url}`);
            console.log(`Target: ${download.path}`);
            
            const startTime = Date.now();
            await fetchPDF(download.url, download.path);
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            
            console.log(`✓ Successfully downloaded (${duration}s)`);
        } catch (error) {
            console.error(`✗ Failed to download PDF ${index + 1}:`, error.message);
        }
    }
    
    console.log('\nAll downloads completed!');
}

// Execute the downloads
downloadAllPDFs().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});