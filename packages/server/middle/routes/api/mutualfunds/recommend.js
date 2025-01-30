const _ = require('lodash');
const getData = require("./getData.js");

const DEFAULT_CONFIG = {
    significant_holding_threshold: 0.5,
    max_etfs_to_recommend: 3,
    weights: {
        stock_coverage: 0.4,
        sector_match: 0.2,
        expense_ratio: 0.25,
        aum_score: 0.15
    }
};

// Core date and holdings utility functions
const getLatestHoldingsDate = (holdings) => {
    return new Date(Math.max(...holdings.map(h => new Date(h.stock_holding_reporting_date))));
};

const getLatestHoldings = (holdings, latestDate) => {
    return holdings.filter(h => new Date(h.stock_holding_reporting_date).getTime() === latestDate.getTime());
};

// Core similarity calculation functions
const calculateHoldingsSimilarity = (holdings1, holdings2) => {
    const map1 = new Map(holdings1.map(h => [h.stock_name, h.stock_holding_percentage_in_fund]));
    const map2 = new Map(holdings2.map(h => [h.stock_name, h.stock_holding_percentage_in_fund]));
    
    let similarityScore = 0;
    const allStocks = new Set([...map1.keys(), ...map2.keys()]);
    
    for (const stock of allStocks) {
        const weight1 = map1.get(stock) || 0;
        const weight2 = map2.get(stock) || 0;
        similarityScore += 1 - Math.abs(weight1 - weight2) / Math.max(weight1, weight2, 1);
    }
    
    return similarityScore / allStocks.size;
};

const calculateSectorSimilarity = (holdings1, holdings2) => {
    const getSectorWeights = (holdings) => {
        const weights = {};
        holdings.forEach(h => {
            weights[h.stock_sector] = (weights[h.stock_sector] || 0) + h.stock_holding_percentage_in_fund;
        });
        return weights;
    };
    
    const sectors1 = getSectorWeights(holdings1);
    const sectors2 = getSectorWeights(holdings2);
    
    const allSectors = new Set([...Object.keys(sectors1), ...Object.keys(sectors2)]);
    let similarityScore = 0;
    
    for (const sector of allSectors) {
        const weight1 = sectors1[sector] || 0;
        const weight2 = sectors2[sector] || 0;
        similarityScore += 1 - Math.abs(weight1 - weight2) / Math.max(weight1, weight2, 1);
    }
    
    return similarityScore / allSectors.size;
};

const calculateExpenseSimilarity = (expense1, expense2) => {
    return 1 - Math.abs(expense1 - expense2) / Math.max(expense1, expense2, 0.01);
};

const calculateAUMSimilarity = (aum1, aum2) => {
    return 1 - Math.abs(aum1 - aum2) / Math.max(aum1, aum2, 1);
};

// Main similarity scoring function used by both normal and reverse matching
const calculateSimilarityScore = (fund1, fund2, config = DEFAULT_CONFIG) => {
    const latestDate1 = getLatestHoldingsDate(fund1.mutual_fund_stock_holdings);
    const latestDate2 = getLatestHoldingsDate(fund2.mutual_fund_stock_holdings);
    
    const holdings1 = getLatestHoldings(fund1.mutual_fund_stock_holdings, latestDate1);
    const holdings2 = getLatestHoldings(fund2.mutual_fund_stock_holdings, latestDate2);
    
    const holdingsSimilarity = calculateHoldingsSimilarity(holdings1, holdings2);
    const sectorSimilarity = calculateSectorSimilarity(holdings1, holdings2);
    const expenseSimilarity = calculateExpenseSimilarity(
        fund1.mutual_fund_expenses_ratio,
        fund2.mutual_fund_expenses_ratio
    );
    const aumSimilarity = calculateAUMSimilarity(
        fund1.mutual_fund_aum,
        fund2.mutual_fund_aum
    );
    
    const totalScore = (
        holdingsSimilarity * config.weights.stock_coverage +
        sectorSimilarity * config.weights.sector_match +
        expenseSimilarity * config.weights.expense_ratio +
        aumSimilarity * config.weights.aum_score
    );
    console.log(fund1.mutual_fund_name, fund2.mutual_fund_name, totalScore)
    return {
        similarity_score: totalScore,
        score_breakdown: {
            holdings_similarity: holdingsSimilarity,
            sector_similarity: sectorSimilarity,
            expense_similarity: expenseSimilarity,
            aum_similarity: aumSimilarity
        },
        expense_comparison: {
            fund1_expense: fund1.mutual_fund_expenses_ratio,
            fund2_expense: fund2.mutual_fund_expenses_ratio,
            difference: fund1.mutual_fund_expenses_ratio - fund2.mutual_fund_expenses_ratio
        }
    };
};

// Portfolio consolidation for multiple funds
const consolidatePortfolio = (fundList) => {
    // Combine all latest holdings with weighted positions
    const totalAUM = _.sumBy(fundList, 'mutual_fund_aum');
    
    const consolidatedHoldings = [];
    const processedStocks = new Map();
    
    fundList.forEach(fund => {
        const fundWeight = fund.mutual_fund_aum / totalAUM;
        const latestDate = getLatestHoldingsDate(fund.mutual_fund_stock_holdings);
        const holdings = getLatestHoldings(fund.mutual_fund_stock_holdings, latestDate);
        
        holdings.forEach(holding => {
            const adjustedWeight = holding.stock_holding_percentage_in_fund * fundWeight;
            if (processedStocks.has(holding.stock_name)) {
                const index = processedStocks.get(holding.stock_name);
                consolidatedHoldings[index].stock_holding_percentage_in_fund += adjustedWeight;
            } else {
                processedStocks.set(holding.stock_name, consolidatedHoldings.length);
                consolidatedHoldings.push({
                    ...holding,
                    stock_holding_percentage_in_fund: adjustedWeight
                });
            }
        });
    });

    return {
        mutual_fund_stock_holdings: consolidatedHoldings,
        mutual_fund_aum: totalAUM,
        mutual_fund_expenses_ratio: _.meanBy(fundList, 'mutual_fund_expenses_ratio')
    };
};

// Main functions for both use cases
const findSimilarETFs = async (fundList, config = DEFAULT_CONFIG) => {
    const mutual_fund_data = await getData(fundList,  []);
    const consolidatedPortfolio = consolidatePortfolio(mutual_fund_data);
    const etf_data = await getData([], ["ETF"]);
    
    const etfMatches = etf_data.map(etf => ({
        etf_name: etf.mutual_fund_name,
        etf_category: etf.mutual_fund_category,
        ...calculateSimilarityScore(consolidatedPortfolio, etf, config)
    }));
    
    return _.orderBy(etfMatches, ['similarity_score'], ['desc'])
        .slice(0, config.max_etfs_to_recommend);
};

const reverseETFMatch = async (etfName, config = DEFAULT_CONFIG) => {
    const mutual_fund_data = await getData([], []);
    const etf_data = await getData([], ["ETF"]);
    
    const targetETF = etf_data.find(etf => etf.mutual_fund_name === etfName[0]);
    if (!targetETF) {
        throw new Error(`ETF ${etfName} not found`);
    }
    
    const fundMatches = mutual_fund_data.map(fund => ({
        fund_name: fund.mutual_fund_name,
        fund_category: fund.mutual_fund_category,
        ...calculateSimilarityScore(targetETF, fund, config)
    }));
    
    // Filter for significant matches and sort by similarity
    return {
        etf_details: {
            name: targetETF.mutual_fund_name,
            aum: targetETF.mutual_fund_aum,
            expense_ratio: targetETF.mutual_fund_expenses_ratio,
            category: targetETF.mutual_fund_category
        },
        matching_funds: _.orderBy(
            fundMatches.filter(match => match.similarity_score >= 0.75),
            ['similarity_score'],
            ['desc']
        )
    };
};

// Route handler
const route = async (req, res) => {
    try {
        const config = { ...DEFAULT_CONFIG, ...req.body.config };
        
        if (req.body.reverse_match_etf) {
            const reverseMatchResults = await reverseETFMatch(req.body.reverse_match_etf, config);
            res.status(200).json({ reverse_match: reverseMatchResults });
        } else {
            const { fundList } = req.body;
            const etfRecommendations = await findSimilarETFs(fundList, config);
            res.status(200).json({ etf_recommendations: etfRecommendations });
        }
    } catch (error) {
        console.error('Error analyzing funds:', error);
        res.status(500).json({ error: 'Failed to analyze funds' });
    }
};

module.exports = route;