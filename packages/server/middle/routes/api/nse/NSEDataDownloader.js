const axios = require('axios');
const https = require('https');

class NSEDataDownloader {
    constructor() {
        // Base configuration
        this.baseURL = 'https://www.nseindia.com';
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        this.cookies = new Map();
    }

    async refreshSession() {
        try {
            // Create an axios instance that handles redirects and cookies
            const instance = axios.create({
                httpsAgent: new https.Agent({ keepAlive: true }),
                maxRedirects: 5,
                withCredentials: true,
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Cache-Control': 'max-age=0'
                }
            });

            // First, visit the main page to get initial cookies
            const response = await instance.get(`${this.baseURL}/market-data/exchange-traded-funds-etf`);
            
            // Extract cookies from response headers
            const cookieHeaders = response.headers['set-cookie'];
            if (cookieHeaders) {
                cookieHeaders.forEach(cookie => {
                    const [nameValue] = cookie.split(';');
                    const [name, value] = nameValue.split('=');
                    this.cookies.set(name, value);
                });
            }

            return this.getCookieString();
        } catch (error) {
            throw new Error(`Failed to refresh session: ${error.message}`);
        }
    }

    getCookieString() {
        return Array.from(this.cookies.entries())
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');
    }

    async downloadETFData() {
        try {
            const cookieString = await this.refreshSession();
            console.log('session cookie string', cookieString)
            const response = await axios.get(`${this.baseURL}/api/etf`, {
                params: {
                    csv: true,
                    selectValFormat: 'crores'
                },
                headers: {
                    'User-Agent': this.userAgent,
                    'Cookie': cookieString,
                    'Referer': `${this.baseURL}/market-data/exchange-traded-funds-etf`,
                    'Accept': 'text/csv,application/json'
                },
                responseType: 'text'
            });

            return response.data;
        } catch (error) {
            throw new Error(`Failed to download ETF data: ${error.message}`);
        }
    }
}

// Example usage
async function main() {
    const downloader = new NSEDataDownloader();
    try {
        const csvData = await downloader.downloadETFData();
        console.log('Successfully downloaded CSV data:', csvData.substring(0, 200) + '...');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

module.exports = NSEDataDownloader;