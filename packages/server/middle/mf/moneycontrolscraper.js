const puppeteer = require('puppeteer');
const fs = require('fs');
// Utility function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const outputFolder = process.env.DATA_ROOT_FOLDER
// List of mutual fund categories to scrape
const FUND_CATEGORIES = [
    
    'multi-cap-fund',
    'large-cap-fund',
    'large-and-mid-cap-fund',
    'mid-cap-fund',
    'small-cap-fund',
    'elss-tax-saving-schemes',
    'dividend-yield-fund',
    'contra-fund',
    'focused-fund',
    'value-fund',
    'flexi-cap-fund',
    
    /*'aggressive-hybrid-fund',
    'conservative-hybrid-fund',
    'arbitrage-fund',
    'equity-savings',
    'dynamic-asset-allocation-or-balanced-advantage',
    'multi-asset-allocation'*/
    /*'childrens-fund',
    'retirement-fund',
    'investment-cum-insurance'
    'index-fundsetfs',
    'fund-of-funds',*/
];

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

async function scrapeCategoryPage(page, category) {
    let url = `https://www.moneycontrol.com/mutual-funds/performance-tracker/returns/${category}.html`;
    if ('index-fundsetfs' === category)
        url = `https://www.moneycontrol.com/mutual-funds/performance-tracker/portfolioassets/${category}.html`;
    console.log(`Scraping category: ${category}`);
    
    try {
        await delay(2000); // Delay before navigation
        await page.goto(url, {
            waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
            timeout: 30000
        });

        // Simulate human behavior
        await delay(1000);
        await page.mouse.move(100, 100);
        await page.mouse.wheel({ deltaY: 200 });

        // Extract funds data
        const fundsData = await page.evaluate(() => {
            // First get the column indices from headers
            const headerRow = document.querySelector('table thead tr');
            const columnIndices = {};
            
            if (headerRow) {
                const headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());
                columnIndices.name = headers.findIndex(h => h.includes('Scheme Name'));
                columnIndices.plan = headers.findIndex(h => h.includes('Plan'));
                columnIndices.category = headers.findIndex(h => h.includes('Category Name'));
                columnIndices.rating = headers.findIndex(h => h.includes('Crisil Rating'));
                columnIndices.aum = headers.findIndex(h => h.includes('AuM'));
                columnIndices.returns = {
                    '1W': headers.findIndex(h => h === '1W'),
                    '1M': headers.findIndex(h => h === '1M'),
                    '3M': headers.findIndex(h => h === '3M'),
                    '6M': headers.findIndex(h => h === '6M'),
                    'YTD': headers.findIndex(h => h === 'YTD'),
                    '1Y': headers.findIndex(h => h === '1Y'),
                    '2Y': headers.findIndex(h => h === '2Y'),
                    '3Y': headers.findIndex(h => h === '3Y'),
                    '5Y': headers.findIndex(h => h === '5Y'),
                    '10Y': headers.findIndex(h => h === '10Y')
                };
            }

            const funds = [];
            const rows = document.querySelectorAll('table tbody tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 1) {
                    const link = cells[columnIndices.name]?.querySelector('a');
                    if (link) {
                        const url = link.href;
                        
                        // Skip ad clicks and non-mutual fund URLs
                        if (url.includes('Click_Tracker') || 
                            url.includes('doubleclick') || 
                            !url.includes('moneycontrol.com/mutual-funds/')) {
                            return;
                        }

                        const name = link.textContent.trim();
                        
                        // Skip entries with suspicious names
                        if (name.toLowerCase().includes('invest now') ||
                            name.toLowerCase().includes('advertisement')) {
                            return;
                        }

                        // Extract scheme code and validate it
                        const schemeCode = url.split('/').pop();
                        if (!schemeCode || schemeCode.includes('?') || schemeCode === 'MC_Click_Tracker') {
                            return;
                        }

                        // Get category from URL and validate
                        const urlParts = url.split('/');
                        const urlCategory = urlParts.length >= 5 ? urlParts[4] : '';
                        if (!urlCategory || urlCategory.includes('?') || urlCategory.includes('clk')) {
                            return;
                        }

                        // Collect all return periods
                        const returns = {};
                        Object.entries(columnIndices.returns).forEach(([period, index]) => {
                            if (index !== -1 && cells[index]) {
                                returns[period] = cells[index].textContent.trim();
                            }
                        });

                        funds.push({
                            name,
                            url,
                            schemeCode,
                            urlCategory,
                            plan: columnIndices.plan !== -1 ? cells[columnIndices.plan]?.textContent.trim() : '',
                            category: columnIndices.category !== -1 ? cells[columnIndices.category]?.textContent.trim() : '',
                            rating: columnIndices.rating !== -1 ? cells[columnIndices.rating]?.textContent.trim() : '',
                            aum: columnIndices.aum !== -1 ? cells[columnIndices.aum]?.textContent.trim() : '',
                            returns
                        });
                    }
                }
            });
            console.log('Column indices found:', columnIndices); // Debug log
            return funds;
        });

        console.log(`Found ${fundsData.length} funds in category ${category}`);
        return fundsData;

    } catch (error) {
        console.error(`Error scraping category ${category}:`, error.message);
        return []; // Return empty array on error to continue with other categories
    }
}

async function getAllMutualFunds(categories) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"',
            '--enable-javascript',
            '--window-size=1920,1080',
            '--disable-gpu', '--disable-setuid-sandbox'
            
        ]
    });
    
    const allFunds = [];
    let filteredFunds = FUND_CATEGORIES
    if (categories.length > 0) filteredFunds = FUND_CATEGORIES.filter(_ => categories.indexOf(_) > -1)
        console.log("filtered funds", filteredFunds)
    try {
        const page = await setupPage(browser);
        // Scrape each category
        for (const category of filteredFunds) {
            const categoryFunds = await scrapeCategoryPage(page, category);
            allFunds.push(...categoryFunds);
            const outputFile = `${outputFolder}/${category}/mutual_funds_data.json`;
            if (!fs.existsSync(`${outputFolder}/${category}`)) fs.mkdirSync(`${outputFolder}/${category}`);
            fs.writeFileSync(outputFile, JSON.stringify(categoryFunds, null, 2));
            // Add longer delay between categories
            await delay(3000 + Math.random() * 2000); // Random delay 3-5 seconds
        }
        return allFunds;

    } catch (error) {
        console.error('Fatal error:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function main() {
    const args = process.argv.slice(2);
    try {
        //else categoryInput = args[1].split(",")
        console.log('Starting scraper for...', args);
        const funds = await getAllMutualFunds(args);
        console.log(`Scraping complete. Found total ${funds.length} funds`);
        
        // Print some statistics
        const categoryCounts = funds.reduce((acc, fund) => {
            acc[fund.category] = (acc[fund.category] || 0) + 1;
            return acc;
        }, {});
        console.log('\nFunds per category:');
        console.log(categoryCounts);
        
    } catch (error) {
        console.error('Main error:', error);
    }
}
module.exports = {
    getAllMutualFunds
}
//main();