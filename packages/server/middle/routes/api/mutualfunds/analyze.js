const _ = require('lodash');
const getData = require("./getData.js")

const getLatestHoldingsDate = (holdings) => {
    return new Date(Math.max(...holdings.map(h => new Date(h.stock_holding_reporting_date))));
};

const getLatestHoldings = (holdings, latestDate) => {
    return holdings.filter(h => new Date(h.stock_holding_reporting_date).getTime() === latestDate.getTime());
};

const calculateStockOverlap = (fund1, fund2) => {
    const holdings1 = getLatestHoldings(fund1.mutual_fund_stock_holdings, getLatestHoldingsDate(fund1.mutual_fund_stock_holdings));
    const holdings2 = getLatestHoldings(fund2.mutual_fund_stock_holdings, getLatestHoldingsDate(fund2.mutual_fund_stock_holdings));
    
    const stocks1 = new Set(holdings1.map(h => h.stock_name));
    const stocks2 = new Set(holdings2.map(h => h.stock_name));
    
    const overlappingStocks = new Set([...stocks1].filter(x => stocks2.has(x)));
    
    // Calculate total percentage overlap
    const overlapPercentage = (overlappingStocks.size / Math.min(stocks1.size, stocks2.size)) * 100;
    
    // Get detailed holdings for overlapping stocks
    const overlappingHoldings = Array.from(overlappingStocks).map(stock => ({
        stock_name: stock,
        fund1_holding: holdings1.find(h => h.stock_name === stock)?.stock_holding_percentage_in_fund || 0,
        fund2_holding: holdings2.find(h => h.stock_name === stock)?.stock_holding_percentage_in_fund || 0
    }));

    return {
        overlap_percentage: Number(overlapPercentage.toFixed(2)),
        overlapping_stocks: overlappingHoldings,
        fund1_unique_stocks: Array.from(stocks1).filter(x => !stocks2.has(x)),
        fund2_unique_stocks: Array.from(stocks2).filter(x => !stocks1.has(x)),
        comparison_metadata: {
            fund1: {
                name: fund1.mutual_fund_name,
                aum: fund1.mutual_fund_aum,
                star_rating: fund1.mutual_fund_star_rating,
                expenses_ratio: fund1.mutual_fund_fee_percentage
            },
            fund2: {
                name: fund2.mutual_fund_name,
                aum: fund2.mutual_fund_aum,
                star_rating: fund2.mutual_fund_star_rating,
                expenses_ratio: fund2.mutual_fund_fee_percentage
            }
        }
    };
};

const calculatePortfolioDiversification = (fundList) => {
    // Combine all latest holdings
    const allHoldings = fundList.flatMap(fund => {
        const latestDate = getLatestHoldingsDate(fund.mutual_fund_stock_holdings);
        return getLatestHoldings(fund.mutual_fund_stock_holdings, latestDate);
    });

    // Unique stocks analysis
    const uniqueStocks = new Set(allHoldings.map(h => h.stock_name));
    
    // Sector breakdown
    const sectorBreakdown = _.chain(allHoldings)
        .groupBy('stock_sector')
        .mapValues(holdings => ({
            percentage: Number((_.sumBy(holdings, 'stock_holding_percentage_in_fund') / holdings.length).toFixed(2))
        }))
        .value();

    // Fund category breakdown
    const categoryBreakdown = _.chain(fundList)
        .groupBy('mutual_fund_category')
        .mapValues(funds => ({
            count: funds.length,
            percentage: Number(((funds.length / fundList.length) * 100).toFixed(2))
        }))
        .value();

    return {
        unique_stocks: {
            count: uniqueStocks.size,
            status: uniqueStocks.size > 100 ? 'over-diversified' : 
                    uniqueStocks.size < 30 ? 'concentrated' : 'optimal',
            recommendation: uniqueStocks.size > 100 ? 
                'Consider consolidating holdings to reduce complexity' :
                uniqueStocks.size < 30 ? 
                'Consider adding more diversity to reduce concentration risk' :
                'Stock count is within optimal range'
        },
        sector_breakdown: sectorBreakdown,
        category_breakdown: categoryBreakdown
    };
};

const route = async (req, res) => {
    const { fundList } = req.body;
    const reportData = {};
    const compareResults = {
        overlaps: [],
        maxOverlap: null,
        minOverlap: null,
        maxOverlapPair: null,
        minOverlapPair: null
    };

    try {
        const mutual_fund_data = await getData(fundList);

        // Calculate pairwise overlaps
        for (let i = 0; i < mutual_fund_data.length; i++) {
            for (let j = i + 1; j < mutual_fund_data.length; j++) {
                const overlap = calculateStockOverlap(
                    mutual_fund_data[i],
                    mutual_fund_data[j]
                );
                
                compareResults.overlaps.push(overlap);
                
                // Track max/min overlaps
                if (!compareResults.maxOverlap || overlap.overlap_percentage > compareResults.maxOverlap) {
                    compareResults.maxOverlap = overlap.overlap_percentage;
                    compareResults.maxOverlapPair = overlap;
                }
                if (!compareResults.minOverlap || overlap.overlap_percentage < compareResults.minOverlap) {
                    compareResults.minOverlap = overlap.overlap_percentage;
                    compareResults.minOverlapPair = overlap;
                }
            }
        }

        // Calculate diversification metrics
        const diversificationAnalysis = calculatePortfolioDiversification(mutual_fund_data);

        // Additional suggested analytics
        const expenseAnalysis = mutual_fund_data.map(fund => ({
            fund_name: fund.mutual_fund_name,
            expense_ratio: fund.mutual_fund_fee_percentage,
            category_avg: fund.mutual_fund_category_fee_percentage,
            relative_cost: Number((fund.mutual_fund_fee_percentage - fund.mutual_fund_category_fee_percentage).toFixed(2))
        }));

        reportData.overlaps = compareResults;
        reportData.diversification = diversificationAnalysis;
        reportData.expenses = expenseAnalysis;

        res.status(200).json(reportData);
    } catch (error) {
        console.error('Error analyzing mutual funds:', error);
        res.status(500).json({ error: 'Failed to analyze mutual funds' });
    }
};

module.exports = route;