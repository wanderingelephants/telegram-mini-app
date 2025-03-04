const axios = require('axios');
const moment = require('moment');
const access_token_data = require(process.env.ACCESS_TOKEN_PATH)
const getCandleData = async (dateStr, instrument_id) => {
  try {
    // 1. Parse the input date string
    const inputDate = moment(dateStr, 'YYYY-MM-DD');
    
    // 2. Calculate date 7 days ago
    const sevenDaysAgo = moment(inputDate).subtract(7, 'days');
    
    // Format dates for API request (using 00:00:00 as requested)
    const fromTime = sevenDaysAgo.format('YYYY-MM-DD') + ' 00:00:00';
    const toTime = inputDate.format('YYYY-MM-DD') + ' 00:00:00';
    
    // 3. Create URL for API request
    //const instrument_id = 'your_nifty_instrument_id'; // You'll need to provide this value
    const kiteNiftyQuoteUrl = `https://api.kite.trade/instruments/historical/${instrument_id}/day?from=${fromTime}&to=${toTime}`;
    
    const resp = await axios.get(kiteNiftyQuoteUrl, {
      headers: {
        'X-Kite-Version': 3,
        'Authorization': `token ${access_token_data.data.api_key}:${access_token_data.data.access_token}`
      }
    });
    
    // 5. Process the candle data
    const candles = resp.data.data.candles;
    
    // Skip if there's no data
    if (!candles || candles.length === 0) {
      return { objects: [] };
    }
    
    // Create the result objects array
    const objects = [];
    
    // Process each candle
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      
      // Skip empty candles
      if (!candle || candle.length === 0) {
        continue;
      }
      
      // Extract date and closing price
      const dateTime = moment(candle[0]).format('YYYY-MM-DD');
      const closePrice = candle[4];
      const volume = candle[5];
      
      // Calculate percentage change (compare with previous day's close)
      let percentageChange = null;
      
      // Find the most recent previous non-empty candle
      if (i > 0) {
        // Look back for the most recent previous valid candle
        let j = i - 1;
        while (j >= 0) {
          const prevCandle = candles[j];
          if (prevCandle && prevCandle.length > 0) {
            const previousClose = prevCandle[4];
            percentageChange = ((closePrice - previousClose) / previousClose) * 100;
            percentageChange = parseFloat(percentageChange.toFixed(2)); // Round to 2 decimal places
            break;
          }
          j--;
        }
      }
      
      if (percentageChange)
      objects.push({
        price_date: dateTime,
        percentage_change: percentageChange,
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: closePrice,
        volume_millions: volume / 1000000 // Convert to millions
      });
    }
    
    return { objects };
    
  } catch (error) {
    console.error('Error fetching or processing candle data:', error);
    //throw error;
  }
};

module.exports = { getCandleData };