const defaultConfig = {
  fees: {
      mutualFundFeePercent: 1.0,  // 1% default MF fee
      etfFeePercent: 0.1,         // 0.1% default ETF fee
  },
  portfolio: {
      maxEtfs: 4,                 // Maximum ETFs in recommended portfolio
      minTopHoldingsCoverage: 60, // Minimum coverage of top holdings (%)
      topHoldingsThreshold: 15,   // Number of top holdings to focus on
      significantHoldingCutoff: 70 // Consider holdings up to this cumulative % 
  },
  optimization: {
      minCostReduction: 50,       // Minimum cost reduction target (%)
      maxTrackingError: 15,       // Maximum acceptable tracking error (%)
      weights: {
          stockOverlap: 0.4,        // Weight for stock overlap score
          sectorMatch: 0.3,         // Weight for sector matching
          costReduction: 0.2,       // Weight for fee reduction
          simplification: 0.1       // Weight for portfolio simplification
      }
  },
  analysis: {
      overlapAnalysis: {
          mode: 'both',  // Can be 'percentage', 'money-weighted', or 'both'
          significantHoldingThreshold: 1.0, // Consider holdings above 1% as significant
          reportingThresholds: {
              highFrequency: 75,    // Report stocks present in >75% of funds
              highExposure: 5.0,    // Report stocks with >5% portfolio exposure
              significantOverlap: 3  // Report when stock appears in more than 3 funds
          },
          grouping: {
              frequencyBands: 20,    // Group overlaps in 20% bands
              exposureBands: 2       // Group exposures in 2% bands
          }
      }
  }
};

module.exports = { defaultConfig };