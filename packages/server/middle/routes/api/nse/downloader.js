const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs/promises');
const path = require('path');

puppeteer.use(StealthPlugin);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BrowserDownloader {
    constructor(baseUrl, urlsToDownload, downloadFolder, downloadFileNames){
        this.baseUrl = baseUrl
        this.urlsToDownload = urlsToDownload
        this.downloadFolder = downloadFolder
        this.downloadFileNames  =  downloadFileNames
        console.log("this.downloadFileNames", this.downloadFileNames)
    }
    async saveResponseToFile(response, downloadFolder, downloadFileName) {
        const headers = response.headers();
        console.log('Response headers:', headers);
    
        // Get the response body
        const content = await response.text();
        console.log('First 100 characters of response:', content.slice(0, 100));
    
        // Generate filename based on current timestamp if not provided in headers
        //const filename = headers['content-disposition']?.split('filename=')[1]?.trim() || 
          //              `nse_data_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
        
        const filepath = path.join(downloadFolder, downloadFileName);
        await fs.writeFile(filepath, content);
        console.log('Saved response content to:', filepath);
        return filepath;
    }
    async startDownloads(){
        await fs.mkdir(this.downloadFolder, { recursive: true });
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox', '--disable-setuid-sandbox','--enable-javascript',
                '--window-size=1920,1080', 
                //'--disable-gpu', '--disable-setuid-sandbox'
            ]
        });
        console.log('Browser initialized')
        try{
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
            let randomSleep = Math.floor(Math.random() * 5) + 1
            console.log('Visiting main site...');

            await page.goto(this.baseUrl, {
                waitUntil: ['networkidle0', 'domcontentloaded'],
                timeout: 60000
            });
    
            
    
            // Log cookies before CSV request
            const cookies = await page.cookies();
            console.log('Cookies before CSV request:', 
            cookies.map(c => `${c.name}=${c.value}`).join('; '));

            await delay(randomSleep *  1000);

            for (let i=0; i < this.urlsToDownload.length; i++){
                console.log('Attempting to get file...');
                const fileUrl = `${this.urlsToDownload[i]}`;
                try {
                    console.log('Attempting direct fetch for...', fileUrl);
                    const fileContent = await page.evaluate(async (url) => {
                        const response = await fetch(url, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/pdf,text/csv,application/csv,text/plain,*/*'
                            }
                        });
                        console.log('response', response.ok)
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        
                        // Get the content type from response headers
                        const contentType = response.headers.get('content-type');
                        console.log('contentType', contentType)
                        // Handle different content types appropriately
                        if (contentType && contentType.includes('pdf')) {
                            const arrayBuffer = await response.arrayBuffer();
                            // Convert ArrayBuffer to Base64 string for passing through evaluate
                            return {
                                type: 'pdf',
                                data: btoa(
                                    new Uint8Array(arrayBuffer)
                                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                                )
                            };
                        } else {
                            // For CSV and other text formats
                            return {
                                type: 'text',
                                data: await response.text()
                            };
                        }
                    }, fileUrl);
                    const filename = path.join(this.downloadFolder, this.downloadFileNames[i]);
                        
                    // Outside page.evaluate, handle the response
                    if (fileContent.type === 'pdf') {
                        // Convert base64 back to buffer
                        const buffer = Buffer.from(fileContent.data, 'base64');
                        // Save to file or process as needed
                        await fs.writeFile(filename, buffer);
                    } else {
                        // Handle text content (CSV etc)
                        await fs.writeFile(filename, fileContent.data);
                    }
                    
                } catch (fetchError) {
                    console.log('Direct fetch failed:', fetchError.message);
                    console.log(fetchError)
                }
            
            }
    
            
        }
        catch(error){
            console.error('Error occured:', error)
            throw error
        }
        finally{
            await browser.close()
        }
    }
}
module.exports = BrowserDownloader
