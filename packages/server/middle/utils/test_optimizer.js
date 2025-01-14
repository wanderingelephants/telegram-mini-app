const { PortfolioOptimizer } = require('./portfolio_optimizer');
const { defaultConfig } = require('./config');

async function testOverlapAnalysis() {
    // Sample user portfolio
    const userPortfolio = [
        {
            "schemeCode": "MHDA033",
            "name": "HDFC Defence Fund - Direct Plan - Growth",
            "currentValue": "100000"
        },
        {
            "schemeCode": "MHD1169",
            "name": "HDFC Large Cap Fund - Direct Plan - Growth",
            "currentValue": "100000"
        },
        {
            "schemeCode": "MHDA057",
            "name": "HDFC Manufacturing Fund - Direct Plan - Growth",
            "currentValue": "100000"
        },
        {
            "schemeCode": "MHDA052",
            "name": "HDFC Pharma and Healthcare Fund - Direct Plan - Growth",
            "currentValue": "100000"
        },
        {
            "schemeCode": "MHDA043",
            "name": "HDFC Transportation and Logistics Fund - Direct Plan - Growth",
            "currentValue": "100000"
        },
        {
            "schemeCode": "MPI1134",
            "name": "ICICI Prudential Bluechip Fund - Direct Plan - Growth",
            "currentValue": "100000"
        },
        {
            "schemeCode": "MMOA016",
            "name": "Motilal Oswal Large Cap Fund - Direct Plan - Growth",
            "currentValue": "100000"
        },
        {
            "schemeCode": "MRCA027",
            "name": "Nippon India Innovation Fund - Direct Plan - Growth",
            "currentValue": "100000"
        },
        {
            "schemeCode": "MTA1147",
            "name": "Tata Digital India Fund - Direct Plan - Growth",
            "currentValue": "100000"
        }
    ];

    try {
        const optimizer = new PortfolioOptimizer(defaultConfig);

        console.log('\nAnalyzing portfolio overlap...');
        const overlapAnalysis = await optimizer.analyzePortfolioOverlap(userPortfolio);
        const report = optimizer.generateDetailedOverlapReport(overlapAnalysis);

        // Print Summary
        console.log('\nPortfolio Overlap Analysis:');
        report.summary.general.forEach(line => console.log(line));

        // Print Overlap Analysis
        /*console.log('\nStock Presence Analysis:');
        report.byPresence.forEach(group => {
            console.log(`\n${group.description} (${group.count} stocks):`);
            console.log(`  Bucket Totals:`);
            console.log(`    Equal-weighted total: ${group.aggregates.equalWeightTotal}`);
            console.log(`    Money-weighted total: ${group.aggregates.moneyWeightTotal}`);
            console.log(`  Stocks in this bucket:`);
            group.stocks.forEach(stock => {
                console.log(`    ${stock.name}:`);
                console.log(`      Average weight: ${stock.averageWeight}`);
                console.log(`      Current exposure: ${stock.exposure}`);
                console.log(`      Sectors: ${Array.from(stock.sectors).join(', ')}`);
                console.log(`      Present in funds:`);
                    stock.funds.forEach(fund => {
                console.log(`        - ${fund.name} (${fund.schemeCode}): ${fund.weight}`);
        });
            });
        });*/
        console.log('\nFund Combination Analysis:');
report.fundCombinations.forEach(combo => {
    console.log('\nOverlapping stocks in funds:');
    combo.funds.forEach(fund => {
        console.log(`  - ${fund.name} (${fund.schemeCode})`);
    });
    
    console.log(`  Number of overlapping stocks: ${combo.stockCount}`);
    console.log(`  Combined weight of overlapping stocks:`);
    console.log(`    Equal-weighted total: ${combo.aggregates.equalWeightTotal}`);
    console.log(`    Money-weighted total: ${combo.aggregates.moneyWeightTotal}`);
    
    console.log('  Overlapping stocks:');
    combo.stocks.forEach(stock => {
        console.log(`    ${stock.name}:`);
        console.log(`      Current exposure: ${stock.exposure}`);
        console.log(`      Sectors: ${Array.from(stock.sectors).join(', ')}`);
        console.log('      Weights in each fund:');
        stock.fundWeights.forEach(weight => {
            console.log(`        - ${weight.fundName}: ${weight.percentage.toFixed(2)}%`);
        });
    });
});

    } catch (error) {
        console.error('Error during analysis:', error);
        console.error(error.stack);
    }
}

// Run the test
testOverlapAnalysis().then(() => {
    console.log('\nTest completed');
}).catch(error => {
    console.error('Test failed:', error);
});