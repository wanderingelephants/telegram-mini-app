const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const baseFolder = process.env.DATA_ROOT_FOLDER
const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

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
function getHoldingDateFromDB(schemeCode){
    try{
        console.log("getHoldingDateFromDB", schemeCode)
        const data = db.prepare("select max(reporting_date) as latestHoldingDate from mutual_fund_holdings where scheme_code='"+schemeCode+"'").all()
        if (data.length == 1) return data[0].latestHoldingDate    
    }
    catch(e){
        return ""
    }
    return ""
}
// Function to check if fund holdings already exist
async function checkExistingHoldings(category, schemeCode) {
    const holdingsBasePath = path.join(baseFolder, category, schemeCode, 'holdings');
    const holdingFromDB = getHoldingDateFromDB(schemeCode)
    console.log("holdngFromDB", holdingFromDB)
    try {
        // Check if holdings directory exists
        if (!fs.existsSync(holdingsBasePath)) {
            return "";
        }

        // Get all date folders
        const dateFolders = fs.readdirSync(holdingsBasePath)
            .filter(folder => fs.statSync(path.join(holdingsBasePath, folder)).isDirectory())
            .sort((a, b) => b.localeCompare(a)); // Sort descending to get most recent first

        if (dateFolders.length === 0) {
            return "";
        }

        // Check most recent folder for holdings.json
        const latestFolder = dateFolders[0];
        const holdingsFile = path.join(holdingsBasePath, latestFolder, 'holdings.json');
        
        if (fs.existsSync(holdingsFile)) {
            // Validate the JSON file is properly formed
            try {
                const holdings = JSON.parse(fs.readFileSync(holdingsFile, 'utf8'));
                if (holdings && holdings.holdings && holdings.holdings.length > 0) {
                    console.log(`Skipping ${schemeCode} - Found existing holdings for ${latestFolder}`);
                    return latestFolder;
                }
            } catch (e) {
                console.log(`Invalid holdings file for ${schemeCode}, will reprocess`);
                return "";
            }
        }

        return "";
    } catch (error) {
        console.error(`Error checking existing holdings for ${schemeCode}:`, error);
        return false;
    }
}

// Function to parse the portfolio holdings date
function parseHoldingsDate(dateText) {
    const monthMap = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 
        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}
    // Extract date from format "as on 30th Nov,2024" to "30-Nov-2024"
    const match = dateText.match(/(\d{1,2})[a-z]{2}\s+([A-Za-z]+),(\d{4})/);
    if (match) {
        const [_, day, month, year] = match;
        return `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
    }
    return null;
}

// Function to scrape portfolio holdings for a single fund
async function scrapePortfolioHoldings(page, fund, category) {
    console.log(`Scraping holdings for ${fund.name}`);
    //"/mutual-funds/nav/nippon-india-etf-nifty-next-50-junior-bees/MBM002"
    try {
        // Construct portfolio URL by:
        // 1. Remove '-growth' from fund name
        // 2. Remove '/nav/'
        // 3. Insert '/portfolio-holdings/' after fund name but before scheme code
        const baseUrl = fund.url.replace('-growth', '').replace('/nav/', '/');
        const lastSlashIndex = baseUrl.lastIndexOf('/');
        const portfolioUrl = baseUrl.slice(0, lastSlashIndex) + '/portfolio-holdings' + baseUrl.slice(lastSlashIndex);

        console.log('Portfolio URL:', portfolioUrl);

        await page.goto(portfolioUrl, {
            waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
            timeout: 60000
        });

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
        if (holdingsReportingDate === fund.latestHoldingDate){
            console.log('Latest Holding Date has not changed')
            return null;
        }    
        // Create directory structure
        const holdingsDir = path.join(baseFolder, category, fund.schemeCode, 'holdings', holdingsReportingDate);
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

// Function to process a category
async function processCategory(category, specificSchemeCodes = null) {
    console.log('processCategory', category)
    try {
        const categoryFile = path.join(baseFolder, category, 'mutual_funds_data.json');
        let fundsData = JSON.parse(fs.readFileSync(categoryFile, 'utf8'));

        // Filter funds if specific scheme codes are provided
        if (specificSchemeCodes) {
            fundsData = fundsData.filter(fund => specificSchemeCodes.includes(fund.schemeCode));
            console.log(`Found ${fundsData.length} specific funds in category ${category}`);
            if (fundsData.length === 0) {
                console.log('No matching funds found for the provided scheme codes');
                return;
            }
        }

        // Filter out funds that already have holdings
        const fundsToProcess = [];
        for (const fund of fundsData) {
            const latestHoldingDate = await checkExistingHoldings(category, fund.schemeCode);
            fund.latestHoldingDate = latestHoldingDate
            fundsToProcess.push(fund)
           
        }

        console.log(`Total funds in category: ${fundsData.length}`);
        console.log(`Funds already processed: ${fundsData.length - fundsToProcess.length}`);
        console.log(`Funds to process: ${fundsToProcess.length}`);

        if (fundsToProcess.length === 0) {
            console.log('No new funds to process in this category');
            return;
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
            const results = {
                success: [],
                skipped: fundsData.length - fundsToProcess.length,
                failed: []
            };

            for (const fund of fundsToProcess) {
                console.log(`Processing fund: ${fund.name} (${fund.schemeCode})`);
                try {
                    if (fund.url.endsWith(".html")) {
                        console.log("Skipping", fund.name, fund.url)
                        continue;
                    }
                    const result = await scrapePortfolioHoldings(page, fund, category);
                    if (result) {
                        results.success.push(result);
                    } else {
                        results.failed.push({
                            schemeCode: fund.schemeCode,
                            name: fund.name,
                            error: 'Failed to scrape holdings'
                        });
                    }
                } catch (error) {
                    results.failed.push({
                        schemeCode: fund.schemeCode,
                        name: fund.name,
                        error: error.message
                    });
                }
                await delay(10000 + Math.random() * 2000);
            }

            // Save enhanced summary
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const summaryFile = path.join(
                baseFolder, 
                category, 
                `holdings_summary_${specificSchemeCodes ? 'partial_' : ''}${timestamp}.json`
            );
            
            fs.writeFileSync(summaryFile, JSON.stringify({
                category,
                processedAt: timestamp,
                specificSchemeCodes: specificSchemeCodes || 'all',
                summary: {
                    totalFunds: fundsData.length,
                    alreadyProcessed: fundsData.length - fundsToProcess.length,
                    successfullyProcessed: results.success.length,
                    failedToProcess: results.failed.length
                },
                successfulFunds: results.success,
                failedFunds: results.failed
            }, null, 2));

        } finally {
            await browser.close();
        }

    } catch (error) {
        console.error(`Error processing category ${category}:`, error);
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // No arguments: process all categories
        const categories = fs.readdirSync(baseFolder)
            .filter(dir => fs.statSync(path.join(baseFolder, dir)).isDirectory());
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