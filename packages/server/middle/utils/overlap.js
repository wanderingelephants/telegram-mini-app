// overlap.js
function overlapScore(fundsArray) {
    try {
      if (!Array.isArray(fundsArray) || fundsArray.length < 2) {
        throw new Error("Input must be an array of at least two funds.");
      }
  
      let commonStocks = null; // Start with null, will be populated with the first fund's stocks
  
      for (const fund of fundsArray) {
        if (!fund || !fund.holdings || !Array.isArray(fund.holdings)) {
          console.warn(`Invalid fund data encountered. Skipping fund: ${fund?.fundName || 'Unknown Fund'}`);
          continue; // Skip to the next fund
        }
  
        const fundStocks = new Set();
        for (const holding of fund.holdings) {
          if (typeof holding["Stock Invested in"] === 'string') {
            fundStocks.add(holding["Stock Invested in"]);
          }
        }
  
        if (commonStocks === null) {
          commonStocks = fundStocks; // Initialize with the first fund's stocks
        } else {
          // Perform intersection
          const intersection = new Set();
          for (const stock of commonStocks) {
            if (fundStocks.has(stock)) {
              intersection.add(stock);
            }
          }
          commonStocks = intersection;
        }
      }
  
      if (!commonStocks || commonStocks.size === 0) {
        return {
          fund_1: fundsArray.length > 0 ? fundsArray[0].fundName : "N/A",
          fund_2: fundsArray.length > 1 ? fundsArray[1].fundName : "N/A",
          overlapScore: 0,
          commonStocks: []
        }; // No common stocks
      }
  
      const commonStocksDetails = [];
      let overlapScore = 0;
  
      for (const stock of commonStocks) {
          const stockDetails = { stockName: stock };
          let minWeight = Infinity;
          for (const fund of fundsArray) {
              const holding = fund.holdings?.find(h => h["Stock Invested in"] === stock);
              const weightStr = holding ? holding["% of Total Holdings"] : "0%";
              const weight = parseFloat(weightStr.replace("%", ""));
              stockDetails[fund.fundName] = weight;
              minWeight = Math.min(minWeight, weight);
          }
          stockDetails.overlapWeight = minWeight;
          overlapScore += minWeight;
          commonStocksDetails.push(stockDetails);
      }
  
      commonStocksDetails.sort((a, b) => b.overlapWeight - a.overlapWeight);
  
      return {
        fund_1: fundsArray.length > 0 ? fundsArray[0].fundName : "N/A",
        fund_2: fundsArray.length > 1 ? fundsArray[1].fundName : "N/A",
        overlapScore: parseFloat(overlapScore.toFixed(2)),
        commonStocks: commonStocksDetails
      };
    } catch (error) {
      console.error("Error calculating overlap:", error.message);
      return {
        fund_1: "Error",
        fund_2: "Error",
        overlapScore: NaN,
        commonStocks: []
      };
    }
  }
  
  module.exports = { overlapScore };