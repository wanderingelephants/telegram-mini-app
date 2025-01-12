const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Utility function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Setup browser page with proper headers
async function setupPage(browser) {
    const page = await browser.newPage();
    
    await page.setViewport({
        width: 1280,
        height: 800
    });

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Connection': 'keep-alive',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
    });

    await page.setJavaScriptEnabled(true);
    return page;
}

// Function to parse the portfolio holdings date
function parseHoldingsDate(dateText) {
    // Extract date from format "as on 30th Nov,2024" to "30-Nov-2024"
    const match = dateText.match(/(\d{1,2})[a-z]{2}\s+([A-Za-z]+),(\d{4})/);
    if (match) {
        const [_, day, month, year] = match;
        return `${day.padStart(2, '0')}-${month}-${year}`;
    }
    return null;
}

// Function to scrape portfolio holdings for a single fund
async function scrapePortfolioHoldings(page, fund, category) {
    console.log(`Scraping holdings for ${fund.name}`);
    
    try {
        // Construct portfolio URL by removing "-growth" and changing nav to portfolio-holdings
        const baseUrl = fund.url.replace('-growth', '').replace('/nav/', '/');
const lastSlashIndex = baseUrl.lastIndexOf('/');
const portfolioUrl = baseUrl.slice(0, lastSlashIndex) + '/portfolio-holdings' + baseUrl.slice(lastSlashIndex);

console.log('Original URL:', fund.url);
console.log('Portfolio URL:', portfolioUrl);

await page.goto(portfolioUrl, {
    waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
    timeout: 30000
});
        console.log('fetched', portfolioUrl)
        await delay(2000);

        // Extract holdings date
        const holdingsDateText = await page.evaluate(() => {
            const dateSpan = document.querySelector('h2.title_24px span.subtext');
            return dateSpan ? dateSpan.textContent : null;
        });

        if (!holdingsDateText) {
            console.error(`Could not find holdings date for ${fund.name}`);
            return null;
        }

        const holdingsReportingDate = parseHoldingsDate(holdingsDateText);
        if (!holdingsReportingDate) {
            console.error(`Could not parse holdings date from ${holdingsDateText}`);
            return null;
        }

        // Create directory structure
        const holdingsDir = path.join('../../downloads/moneycontrol', category, fund.schemeCode, 'holdings', holdingsReportingDate);
        if (!fs.existsSync(holdingsDir)) fs.mkdirSync(holdingsDir, { recursive: true });

        // Extract holdings data
        const holdingsData = await page.evaluate(() => {
            const table = document.querySelector('#equityCompleteHoldingTable');
            if (!table) return null;

            // Get headers
            const headers = Array.from(table.querySelectorAll('thead th'))
                .map(th => th.textContent.trim());

            // Get holdings
            const holdings = Array.from(table.querySelectorAll('tbody tr'))
    .map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const holding = {};
        
        headers.forEach((header, index) => {
            if (cells[index]) {
                if (index === 0) { // Special handling for first column "Stock Invested in"
                    // Get the stock name from the second span (port_right) containing the actual link
                    const stockNameElement = cells[index].querySelector('span.port_right a');
                    if (stockNameElement) {
                        const stockName = stockNameElement.textContent.trim();
                        if (stockName === 'No group') {
                            return null; // Skip this row entirely
                        }
                        holding[header] = stockName;
                    } else {
                        return null; // Skip if we can't find the stock name
                    }
                } else {
                    holding[header] = cells[index].textContent.trim();
                }
            }
        });
        return holding;
    })
    .filter(holding => holding !== null); // Remove any null entries (skipped rows)

            return {
                headers,
                holdings
            };
        });

        if (!holdingsData) {
            console.error(`No holdings data found for ${fund.name}`);
            return null;
        }

        // Save holdings data
        const outputFile = path.join(holdingsDir, 'holdings.json');
        const outputData = {
            fundName: fund.name,
            schemeCode: fund.schemeCode,
            holdingsReportingDate,
            portfolioUrl,
            holdings: holdingsData.holdings
        };

        fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
        console.log(`Saved holdings for ${fund.name} as of ${holdingsReportingDate}`);

        return {
            schemeCode: fund.schemeCode,
            holdingsReportingDate,
            holdingsCount: holdingsData.holdings.length
        };

    } catch (error) {
        console.error(`Error scraping holdings for ${fund.name}:`, error.message);
        return null;
    }
}

// Main function to process all funds in a category
async function processCategory(category) {
    try {
        // Read the category's funds data
        const categoryFile = path.join('../../downloads/moneycontrol', category, 'mutual_funds_data.json');
        const fundsData = JSON.parse(fs.readFileSync(categoryFile, 'utf8'));

        console.log(`Processing ${fundsData.length} funds in category ${category}`);

        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--enable-javascript',
                '--window-size=1920,1080',
                '--disable-gpu', '--disable-setuid-sandbox',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"'
            ]
        });

        try {
            const page = await setupPage(browser);
            const results = [];

            for (const fund of fundsData) {
                const result = await scrapePortfolioHoldings(page, fund, category);
                if (result) results.push(result);
                await delay(3000 + Math.random() * 2000); // Random delay between funds
            }

            // Save summary of processing
            const summaryFile = path.join('../../downloads/moneycontrol', category, 'holdings_summary.json');
            fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2));

        } finally {
            await browser.close();
        }

    } catch (error) {
        console.error(`Error processing category ${category}:`, error);
    }
}

// Modified processCategory to handle specific scheme codes
async function processCategory(category, specificSchemeCodes = null) {
    try {
        const categoryFile = path.join('../../downloads/moneycontrol', category, 'mutual_funds_data.json');
        let fundsData = JSON.parse(fs.readFileSync(categoryFile, 'utf8'));

        // Filter funds if specific scheme codes are provided
        if (specificSchemeCodes) {
            fundsData = fundsData.filter(fund => specificSchemeCodes.includes(fund.schemeCode));
            console.log(`Processing ${fundsData.length} specific funds in category ${category}`);
            if (fundsData.length === 0) {
                console.log('No matching funds found for the provided scheme codes');
                return;
            }
        } else {
            console.log(`Processing all ${fundsData.length} funds in category ${category}`);
        }

        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"'
            ]
        });

        try {
            const page = await setupPage(browser);
            const results = [];

            for (const fund of fundsData) {
                console.log(`Processing fund: ${fund.name} (${fund.schemeCode})`);
                const result = await scrapePortfolioHoldings(page, fund, category);
                if (result) results.push(result);
                await delay(3000 + Math.random() * 2000); // Random delay between funds
            }

            // Save summary with timestamp to track different processing runs
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const summaryFile = path.join(
                '../../downloads/moneycontrol', 
                category, 
                `holdings_summary_${specificSchemeCodes ? 'partial_' : ''}${timestamp}.json`
            );
            
            fs.writeFileSync(summaryFile, JSON.stringify({
                category,
                processedAt: timestamp,
                specificSchemeCodes: specificSchemeCodes || 'all',
                totalProcessed: results.length,
                results
            }, null, 2));

        } finally {
            await browser.close();
        }

    } catch (error) {
        console.error(`Error processing category ${category}:`, error);
    }
}

// Process specific category/schemes or all categories
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // No arguments: process all categories
        const categories = fs.readdirSync('../../downloads/moneycontrol')
            .filter(dir => fs.statSync(path.join('../../downloads/moneycontrol', dir)).isDirectory());
        console.log(`Processing all funds in categories: ${categories.join(', ')}`);
        
        for (const category of categories) {
            await processCategory(category);
            await delay(5000);
        }
    } else {
        const category = args[0];
        const schemeCodes = args[1] ? args[1].split(',').map(code => code.trim()) : null;
        
        if (schemeCodes) {
            console.log(`Processing specific schemes in ${category}:`, schemeCodes);
        } else {
            console.log(`Processing all funds in category: ${category}`);
        }
        
        await processCategory(category, schemeCodes);
    }
}

main().catch(console.error);