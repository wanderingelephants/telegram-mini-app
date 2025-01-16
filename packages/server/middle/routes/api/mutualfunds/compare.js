const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const route = async (req, res) => {
    const { fundList } = req.body;
    const compareResults = {
        overlaps: [],
        maxOverlap: null,
        minOverlap: null,
        maxOverlapPair: null,
        minOverlapPair: null
    };

    try {
        // Convert array to comma-separated string for SQL IN clause
        const fundListStr = fundList.map(fund => `'${fund}'`).join(',');

        // Get mutual fund IDs and holdings in one query
        const query = `
            WITH fund_ids AS (
                SELECT id, mutual_fund_name
                FROM mutual_fund
                WHERE mutual_fund_name IN (${fundListStr})
            )
            SELECT 
                mf.mutual_fund_name,
                mfh.stock_name,
                mfh.stock_holding_in_percentage
            FROM fund_ids mf
            JOIN mutual_fund_holdings mfh ON mf.id = mfh.mutual_fund_id
            ORDER BY mf.mutual_fund_name, mfh.stock_holding_in_percentage DESC`;

        // Execute query and get all holdings
        const holdings = db.prepare(query).all();

        // Group holdings by fund name
        const fundHoldings = holdings.reduce((acc, row) => {
            if (!acc[row.mutual_fund_name]) {
                acc[row.mutual_fund_name] = [];
            }
            acc[row.mutual_fund_name].push({
                stock_name: row.stock_name,
                percentage: row.stock_holding_in_percentage
            });
            return acc;
        }, {});

        // Calculate overlap scores for each pair
        const fundNames = Object.keys(fundHoldings);
        for (let i = 0; i < fundNames.length; i++) {
            for (let j = i + 1; j < fundNames.length; j++) {
                const fund1 = fundNames[i];
                const fund2 = fundNames[j];
                
                // Create lookup for fund2's holdings
                const fund2Holdings = new Map(
                    fundHoldings[fund2].map(h => [h.stock_name, h.percentage])
                );

                let overlapScore = 0;
                // Compare holdings
                for (const holding of fundHoldings[fund1]) {
                    if (fund2Holdings.has(holding.stock_name)) {
                        // Add minimum of the two percentages to overlap score
                        overlapScore += Math.min(
                            holding.percentage,
                            fund2Holdings.get(holding.stock_name)
                        );
                    }
                }

                // Collect overlapping holdings
                const overlapHoldings = [];
                for (const holding of fundHoldings[fund1]) {
                    const fund2Percent = fund2Holdings.get(holding.stock_name);
                    if (fund2Percent !== undefined) {
                        overlapHoldings.push({
                            stock_name: holding.stock_name,
                            percentHoldingInFund1: holding.percentage,
                            percentHoldingInFund2: fund2Percent,
                            overlapWeight: Math.min(holding.percentage, fund2Percent)
                        });
                    }
                }

                // Sort overlap holdings by overlap weight (descending)
                overlapHoldings.sort((a, b) => b.overlapWeight - a.overlapWeight);

                // Round to 2 decimal places
                overlapScore = Math.round(overlapScore * 100) / 100;

                // Add to results
                const overlapPair = {
                    fund1: fund1,
                    fund2: fund2,
                    overlapScore: overlapScore,
                    overlapHoldings: overlapHoldings
                };
                compareResults.overlaps.push(overlapPair);

                // Update max/min overlap
                if (compareResults.maxOverlap === null || overlapScore > compareResults.maxOverlap) {
                    compareResults.maxOverlap = overlapScore;
                    compareResults.maxOverlapPair = { fund1, fund2 };
                }
                if (compareResults.minOverlap === null || overlapScore < compareResults.minOverlap) {
                    compareResults.minOverlap = overlapScore;
                    compareResults.minOverlapPair = { fund1, fund2 };
                }
            }
        }
        compareResults.overlaps.sort((a, b) => b.overlapScore - a.overlapScore )
        return res.status(200).json(compareResults);
    } catch (error) {
        console.error('Error in overlap analysis:', error);
        return res.status(500).json({ error: 'Internal server error during overlap analysis' });
    }
};

module.exports = route;