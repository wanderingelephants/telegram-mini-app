const { overlapScore } = require('./overlap');
const mutualFundA = require('../../../../packages/downloads/moneycontrol/large-cap-fund/MHD1169/holdings/2024-12-31/holdings.json')
const mutualFundB = require('../../../../packages/downloads/moneycontrol/large-cap-fund/MPI1134/holdings/2024-12-31/holdings.json')
const mutualFundC = require('../../../../packages/downloads/moneycontrol/large-cap-fund/MMOA016/holdings/2024-11-30/holdings.json')

const holdingsA = [
    { "Stock Invested in": "Gujarat State Petronet Ltd.", "% of Total Holdings": "2.80%" },
    { "Stock Invested in": "Larsen & Toubro Ltd.", "% of Total Holdings": "2.59%" },
];

const holdingsB = [
    { "Stock Invested in": "Gujarat State Petronet Ltd.", "% of Total Holdings": "1.50%" },
    { "Stock Invested in": "Infosys Ltd.", "% of Total Holdings": "3.00%" },
    {"Stock Invested in": "Larsen & Toubro Ltd.", "% of Total Holdings": "3.59%" }
];
//console.log(mutualFundB)
const fundsArray = []
fundsArray.push(mutualFundA)
fundsArray.push(mutualFundB)
fundsArray.push(mutualFundC)
const result = overlapScore(fundsArray);
console.log(JSON.stringify(result, null, 2));

/*const result2 = overlapScore([], []);
console.log(JSON.stringify(result2, null, 2));

const result3 = overlapScore(null, []);
console.log(JSON.stringify(result3, null, 2));*/