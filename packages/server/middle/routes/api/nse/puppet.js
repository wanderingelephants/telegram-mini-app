const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs/promises');
const path = require('path');

puppeteer.use(StealthPlugin);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class Puppet {
    constructor(){

    }
    async saveResponseToFile(response, downloadPath) {
        const headers = response.headers();
        console.log('Response headers:', headers);
    
        // Get the response body
        const content = await response.text();
        console.log('First 100 characters of response:', content.slice(0, 100));
    
        // Generate filename based on current timestamp if not provided in headers
        const filename = headers['content-disposition']?.split('filename=')[1]?.trim() || 
                        `nse_data_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
        
        const filepath = path.join(downloadPath, filename);
        await fs.writeFile(filepath, content);
        console.log('Saved response content to:', filepath);
        return filepath;
    }
    
    async  downloadCSV(baseUrl, csvUrlSuffix, downloadPath) {
        await fs.mkdir(downloadPath, { recursive: true });
    
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--enable-javascript',
                '--window-size=1920,1080'
            ]
        });
        console.log('Browser initialized')
        try {
            const page = await browser.newPage();
            console.log('newPage done')
            // Enable request interception
            await page.setRequestInterception(true);
    
            // Monitor network requests
            page.on('request', request => {
                if (request.url().includes('corporate-announcements')) {
                    console.log('CSV Request headers:', request.headers());
                }
                request.continue();
            });
    
            // Set headers that might be needed for the API request
            await page.setExtraHTTPHeaders({
                'Accept': 'text/csv,application/csv,text/plain,*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'DNT': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            });
            console.log('page.setExtraHttpHeaders')
            // Visit main site first
            console.log('Visiting main site...');
            await page.goto(baseUrl, {
                waitUntil: ['networkidle0', 'domcontentloaded'],
                timeout: 60000
            });
    
            await delay(5000);
    
            // Log cookies before CSV request
            const cookies = await page.cookies();
            console.log('Cookies before CSV request:', 
                cookies.map(c => `${c.name}=${c.value}`).join('; '));
    
            // Now try to get the CSV
            console.log('Attempting to get CSV...');
            const csvUrl = `${baseUrl}${csvUrlSuffix}`;
            
            // Try to fetch the CSV content directly using page.evaluate
            try {
                console.log('Attempting direct fetch...');
                const csvContent = await page.evaluate(async (url) => {
                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Accept': 'text/csv,application/csv,text/plain,*/*'
                        }
                    });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return await response.text();
                }, csvUrl);
    
                if (csvContent) {
                    const filename = path.join(downloadPath, `nse_data_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`);
                    await fs.writeFile(filename, csvContent);
                    console.log('Successfully saved CSV using direct fetch to:', filename);
                    return;
                }
            } catch (fetchError) {
                console.log('Direct fetch failed:', fetchError.message);
                console.log('Trying alternative method...');
            }
    
            // If direct fetch fails, try navigation method
            const response = await page.goto(csvUrl, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
    
            if (!response) {
                throw new Error('No response received');
            }
    
            console.log('Response status:', response.status());
            
            if (response.status() === 200) {
                // Try to save the response content
                await saveResponseToFile(response, downloadPath);
            } else {
                throw new Error(`Unexpected status code: ${response.status()}`);
            }
    
        } catch (error) {
            console.error('Error occurred:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }
}

module.exports = Puppet

