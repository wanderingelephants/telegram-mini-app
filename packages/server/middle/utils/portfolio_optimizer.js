const path = require('path');
const fs = require('fs').promises;

const ROOT_FOLDER = '../../downloads/moneycontrol';

class PortfolioOptimizer {
    constructor(config) {
        this.config = config;
    }

    async getLatestHoldingsDate(fundPath) {
        const holdingsPath = path.join(fundPath, 'holdings');
        const dates = await fs.readdir(holdingsPath);
        return dates.sort().reverse()[0];
    }

    parseNumericValue(value) {
        if (typeof value === 'string') {
            return parseFloat(value.replace(/,/g, '').replace('%', ''));
        }
        return value;
    }

    async getMFHoldings(schemeCode) {
        const categories = await fs.readdir(ROOT_FOLDER);
        for (const category of categories) {
            if (category === 'etfs') continue;
            
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
                continue;
            }
        }
        throw new Error(`Scheme ${schemeCode} not found in any category`);
    }

    async getETFHoldings(etfName) {
        const etfPath = path.join(ROOT_FOLDER, 'etfs', etfName);
        const latestDate = await this.getLatestHoldingsDate(etfPath);
        const holdingsPath = path.join(etfPath, 'holdings', latestDate, 'holdings.json');
        const data = await fs.readFile(holdingsPath, 'utf8');
        return JSON.parse(data);
    }

    async getAllETFs() {
        const etfsPath = path.join(ROOT_FOLDER, 'etfs');
        const etfs = await fs.readdir(etfsPath);
        return etfs.filter(async (etf) => {
            const stat = await fs.stat(path.join(etfsPath, etf));
            return stat.isDirectory();
        });
    }

    async analyzePortfolioOverlap(userPortfolio) {
        const fundHoldings = new Map();
        const stockFrequency = new Map();
        const stockExposure = new Map();
        const fundCombinations = new Map();
        let totalPortfolioValue = 0;
    
        // Step 1: Collect all holdings and calculate both metrics
        for (const fund of userPortfolio) {
            const currentValue = this.parseNumericValue(fund.currentValue);
            totalPortfolioValue += currentValue;
            const holdings = await this.getMFHoldings(fund.schemeCode);
            fundHoldings.set(fund.schemeCode, holdings);
    
            for (const holding of holdings.holdings) {
                if (!holding['Stock Invested in']) continue;
                
                const stockName = holding['Stock Invested in'];
                const percentage = this.parseNumericValue(holding['% of Total Holdings']);
    
                // Track percentage-based frequency
                if (!stockFrequency.has(stockName)) {
                    stockFrequency.set(stockName, {
                        frequency: 0,
                        totalPercentage: 0,
                        averageWeight: 0,
                        funds: [],
                        sectors: new Set()
                    });
                }
                const freqData = stockFrequency.get(stockName);
                freqData.frequency += 1;
                freqData.totalPercentage += percentage;
                freqData.sectors.add(holding.Sector);
                freqData.funds.push({
                    schemeCode: fund.schemeCode,
                    fundName: holdings.fundName,
                    percentage
                });
    
                // Track money-weighted exposure
                if (!stockExposure.has(stockName)) {
                    stockExposure.set(stockName, {
                        moneyValue: 0,
                        portfolioPercentage: 0,
                        sectors: new Set()
                    });
                }
                const expData = stockExposure.get(stockName);
                expData.moneyValue += (percentage / 100) * currentValue;
                expData.sectors = freqData.sectors;
            }
        }
    
        // Calculate averages for percentage-based analysis
        for (const [, data] of stockFrequency.entries()) {
            data.averageWeight = data.totalPercentage / data.frequency;
        }
    
        // Calculate portfolio percentages for money-weighted analysis
        for (const [stock, data] of stockExposure.entries()) {
            data.portfolioPercentage = (data.moneyValue / totalPortfolioValue) * 100;
        }
    
        // Helper function to generate combination key
        const getCombinationKey = (funds) => {
            return funds.map(f => f.schemeCode).sort().join('|');
        };
    
        // Create fund combinations based on stock presence
        for (const [stockName, data] of stockFrequency.entries()) {
            const fundsList = data.funds.map(f => ({
                schemeCode: f.schemeCode,
                fundName: f.fundName
            }));
    
            // Sort funds to ensure consistent combination keys
            const comboKey = getCombinationKey(fundsList);
            
            if (!fundCombinations.has(comboKey)) {
                fundCombinations.set(comboKey, {
                    funds: fundsList,
                    stocks: [],
                    totalEqualWeight: 0,
                    totalMoneyWeight: 0
                });
            }
    
            const combo = fundCombinations.get(comboKey);
            const stockMoneyWeight = stockExposure.get(stockName).portfolioPercentage;
            
            combo.stocks.push({
                name: stockName,
                averageWeight: data.averageWeight,
                moneyExposure: stockExposure.get(stockName).moneyValue,
                moneyWeight: stockMoneyWeight,
                sectors: Array.from(data.sectors),
                weights: data.funds.map(f => ({
                    fundName: f.fundName,
                    schemeCode: f.schemeCode,
                    percentage: f.percentage
                }))
            });
    
            combo.totalEqualWeight += data.averageWeight;
            combo.totalMoneyWeight += stockMoneyWeight;
        }
    
        return {
            fundCombinations,
            totalFunds: userPortfolio.length,
            totalValue: totalPortfolioValue,
            percentageBased: {
                totalStocks: stockFrequency.size,
                stockData: stockFrequency
            },
            moneyWeighted: {
                stockData: stockExposure
            }
        };
    }
    generateDetailedOverlapReport(overlapAnalysis) {
        const report = {
            summary: {
                general: [],
                warnings: []
            },
            fundCombinations: []
        };
    
        const { fundCombinations, totalFunds, totalValue } = overlapAnalysis;
    
        report.summary.general.push(
            `Analysis of ${totalFunds} mutual funds in your portfolio`,
            `Total portfolio value: ₹${totalValue.toLocaleString('en-IN')}`
        );
    
        // Sort combinations by number of funds (descending) and then by total money weight
        Array.from(fundCombinations.entries())
            .sort((a, b) => {
                const fundCountDiff = b[1].funds.length - a[1].funds.length;
                if (fundCountDiff !== 0) return fundCountDiff;
                return b[1].totalMoneyWeight - a[1].totalMoneyWeight;
            })
            .forEach(([comboKey, data]) => {
                report.fundCombinations.push({
                    funds: data.funds.map(f => ({
                        name: f.fundName,
                        schemeCode: f.schemeCode
                    })),
                    stockCount: data.stocks.length,
                    aggregates: {
                        equalWeightTotal: data.totalEqualWeight.toFixed(2) + '%',
                        moneyWeightTotal: data.totalMoneyWeight.toFixed(2) + '%'
                    },
                    stocks: data.stocks
                        .sort((a, b) => b.moneyWeight - a.moneyWeight)
                        .map(stock => ({
                            name: stock.name,
                            averageWeight: stock.averageWeight.toFixed(2) + '%',
                            exposure: `₹${stock.moneyExposure.toLocaleString('en-IN')} (${stock.moneyWeight.toFixed(2)}% of portfolio)`,
                            sectors: stock.sectors,
                            fundWeights: stock.weights
                        }))
                });
            });
    
        return report;
    }
}

module.exports = { PortfolioOptimizer };