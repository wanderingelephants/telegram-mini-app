const path = require('path');
const fs = require('fs').promises;

const ROOT_FOLDER = '../../downloads/moneycontrol';

const utils = {
    // Find latest holdings date for a fund
    async getLatestHoldingsDate(fundPath) {
        const holdingsPath = path.join(fundPath, 'holdings');
        const dates = await fs.readdir(holdingsPath);
        return dates.sort().reverse()[0]; // Get most recent date
    },

    // Clean and parse numeric values
    parseNumericValue(value) {
        if (typeof value === 'string') {
            // Remove commas and % sign, then convert to float
            return parseFloat(value.replace(/,/g, '').replace('%', ''));
        }
        return value;
    },

    // Get holdings for a mutual fund
    async getMFHoldings(schemeCode) {
        // First, find which category this MF belongs to
        const categories = await fs.readdir(ROOT_FOLDER);
        for (const category of categories) {
            if (category === 'etfs') continue; // Skip ETF folder
            
            const categoryPath = path.join(ROOT_FOLDER, category);
            const stat = await fs.stat(categoryPath);
            if (!stat.isDirectory()) continue;

            const schemePath = path.join(categoryPath, schemeCode);
            try {
                await fs.access(schemePath);
                const latestDate = await this.getLatestHoldingsDate(schemePath);
                const holdingsPath = path.join(schemePath, 'holdings', latestDate, 'holdings.json');
                const data = await fs.readFile(holdingsPath, 'utf8');
                return JSON.parse(data);
            } catch (e) {
                // Scheme not found in this category, continue searching
                continue;
            }
        }
        throw new Error(`Scheme ${schemeCode} not found in any category`);
    },

    // Get holdings for an ETF
    async getETFHoldings(etfName) {
        const etfPath = path.join(ROOT_FOLDER, 'etfs', etfName);
        const latestDate = await this.getLatestHoldingsDate(etfPath);
        const holdingsPath = path.join(etfPath, 'holdings', latestDate, 'holdings.json');
        const data = await fs.readFile(holdingsPath, 'utf8');
        return JSON.parse(data);
    },

    // Get all available ETFs
    async getAllETFs() {
        const etfsPath = path.join(ROOT_FOLDER, 'etfs');
        const etfs = await fs.readdir(etfsPath);
        return etfs.filter(async (etf) => {
            const stat = await fs.stat(path.join(etfsPath, etf));
            return stat.isDirectory();
        });
    },

    // Process user portfolio and flatten holdings
    async processUserPortfolio(userPortfolio) {
        const flattenedHoldings = {};
        let totalValue = 0;

        for (const fund of userPortfolio) {
            const currentValue = this.parseNumericValue(fund.currentValue);
            totalValue += currentValue;
            
            const holdings = await this.getMFHoldings(fund.schemeCode);
            
            // Process each holding
            for (const holding of holdings.holdings) {
                if (!holding['Stock Invested in']) continue; // Skip empty entries
                
                const stockName = holding['Stock Invested in'];
                const percentage = this.parseNumericValue(holding['% of Total Holdings']);
                const value = (percentage / 100) * currentValue;

                if (!flattenedHoldings[stockName]) {
                    flattenedHoldings[stockName] = {
                        value: 0,
                        percentage: 0,
                        sector: holding.Sector
                    };
                }
                
                flattenedHoldings[stockName].value += value;
                flattenedHoldings[stockName].percentage = 
                    (flattenedHoldings[stockName].value / totalValue) * 100;
            }
        }

        return {
            flattenedHoldings,
            totalValue
        };
    }
};
module.exports = utils