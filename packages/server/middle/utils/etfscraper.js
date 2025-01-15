const puppeteer = require('puppeteer');
const fs = require('fs');
// Utility function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const outputFolder = '/Users/sachetsingh1/telegram-mini-app/packages/data'

// Add navigation helper function
async function navigateToPage(page, url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await page.removeAllListeners('load');
            await page.removeAllListeners('domcontentloaded');

            console.log(`Navigation attempt ${attempt} for ${url}`);
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });

            // Additional wait to ensure page is stable
            await delay(2000);

            // Verify page is loaded by checking for a key element
            await page.waitForSelector('#mc_mainWrapper', {
                timeout: 10000
            });

            return true;

        } catch (error) {
            console.log(`Navigation attempt ${attempt} failed:`, error.message);

            if (attempt === maxRetries) {
                throw new Error(`Failed to load page after ${maxRetries} attempts: ${error.message}`);
            }

            await delay(3000 * attempt);  // Exponential backoff

            try {
                await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
            } catch (reloadError) {
                console.log('Page reload failed:', reloadError.message);
            }
        }
    }
}

async function setupPage(browser) {
    const page = await browser.newPage();

    // Add console log listener
    page.on('console', msg => console.log('Browser Log:', msg.text()));

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

async function scrapeETFPage(page) {
    const url = `https://www.moneycontrol.com/mf/etf/`;

    try {
        await delay(2000); // Initial delay

        // Use the new navigation function
        await navigateToPage(page, url);
        console.log('Successfully reached page');

        // Simulate human behavior with try-catch
        try {
            await delay(1000);
            await page.mouse.move(100, 100);
            await page.mouse.wheel({ deltaY: 200 });
        } catch (interactionError) {
            console.log('Mouse interaction error:', interactionError.message);
            // Continue execution even if mouse movements fail
        }

        // Add additional wait for table content
        await page.waitForSelector('#mc_mainWrapper', { timeout: 10000 });

        // First verify the structure exists step by step
        const elementVerification = await page.evaluate(() => {
            const results = {
                wrapper: null,
                div2: null,
                mainTable: null,
                targetTable: null,
                html: ''
            };

            // Check main wrapper
            const wrapper = document.querySelector('#mc_mainWrapper');
            results.wrapper = !!wrapper;

            if (wrapper) {
                // Check second div
                const div2 = wrapper.querySelector('div:nth-child(4) > div > table > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > table:nth-child(3)');
                results.div2 = !!div2;

                // Store relevant HTML for debugging
                results.html = wrapper.innerHTML.slice(0, 500); // First 500 chars
            }

            return results;
        });

        console.log('Element verification:', elementVerification);

        // If the structure isn't what we expect, wait a bit and try again
        if (!elementVerification.wrapper || !elementVerification.div2) {
            console.log('Initial structure not found, waiting 5 seconds...');
            await delay(5000);
        }

        const etfLinks = await page.evaluate(() => {
            const targetTable = document.querySelector('#mc_mainWrapper > div:nth-child(4) > div > table > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > table:nth-child(3)');

            if (!targetTable) {
                console.error('Target table not found');
                return [];
            }

            const rows = Array.from(targetTable.querySelectorAll('tr')).slice(2);
            console.log("rows", rows)
            const links = rows.map(row => {
                const linkElement = row.querySelector('td:first-child a[href]');
                //const etfName = row.querySelector('td:first-child a[title]');
                const asset_size_td = row.querySelector('td:nth-child(4)')

                const one_week_td = row.querySelector('td:nth-child(6)')
                const one_month_td = row.querySelector('td:nth-child(7)')
                const three_month_td = row.querySelector('td:nth-child(8)')
                const six_month_td = row.querySelector('td:nth-child(9)')

                const one_year_td = row.querySelector('td:nth-child(10)')
                const two_year_td = row.querySelector('td:nth-child(11)')
                const three_year_td = row.querySelector('td:nth-child(12)')
                const url = linkElement ? linkElement.getAttribute('href') : null

                let asset_size, one_week, one_month, three_month, six_month, one_year, two_year, three_year, schemeCode;
                if (asset_size_td && asset_size_td.innerText) asset_size = asset_size_td.innerText
                if (one_week_td && one_week_td.innerText) one_week = one_week_td.innerText
                if (one_month_td && one_month_td.innerText) one_month = one_month_td.innerText
                if (three_month_td && three_month_td.innerText) three_month = three_month_td.innerText
                if (six_month_td && six_month_td.innerText) six_month = six_month_td.innerText

                if (one_year_td && one_year_td.innerText) one_year = one_year_td.innerText
                if (two_year_td && two_year_td.innerText) two_year = two_year_td.innerText
                if (three_year_td && three_year_td.innerText) three_year = three_year_td.innerText

                if (url && url !== null) {
                    const toks = url.split("/")
                    schemeCode = toks[toks.length - 1]
                }
                /*const tds = row.querySelector('td')
                for (const td of tds){
                    console.log('td', td)
                } */
                return {
                    "name": linkElement ? linkElement.getAttribute('title') : null,
                    url,
                    schemeCode,
                    "category": "ETF",
                    "aum": asset_size,
                    returns: {
                        "1W": one_week,
                        "1M": one_month,
                        "3M": three_month,
                        "6M": six_month,
                        "1Y": one_year,
                        "2Y": two_year,
                        "3Y": three_year,
                    }
                }
                //return linkElement ? linkElement.getAttribute('href') : null;
            });

            return [...new Set(links.filter(link => link !== null))];
        });

        console.log(`Found ${etfLinks.length} ETF links`);
        return etfLinks;  // Return the links

    } catch (error) {
        console.error(`Error scraping:`, error.message);
        return []; // Return empty array on error
    }
}

async function getAllETFs() {
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
        const allFunds = await scrapeETFPage(page);  // Added await here
        return allFunds;

    } catch (error) {
        console.error('Fatal error:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function main() {
    try {
        console.log('Starting scraper...');
        const funds = await getAllETFs();
        console.log(`Scraping complete. Found total ${funds.length} funds`);

        // Save the results to a file
        if (funds.length > 0) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputPath = `${outputFolder}/etf_links_${timestamp}.json`;
            fs.writeFileSync(outputPath, JSON.stringify(funds, null, 2));
            console.log(`Results saved to ${outputPath}`);
        }

    } catch (error) {
        console.error('Main error:', error);
    }
}

main();