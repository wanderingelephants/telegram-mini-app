curl "https://api.kite.trade/instruments" -o instruments.csv \
  -H "X-Kite-Version: 3" \
  -H "Authorization: token <apikey>:<access_token>"


curl "https://api.kite.trade/instruments/historical/256265/day?from=2025-02-23+09:15:00&to=2025-02-28+15:30:00" \
    -H "X-Kite-Version: 3" \
    -H "Authorization: token kji5cp71pkds249r:Zq95q80JwE04sa04335BcwUYVEvB1Lqu"

    # [timestamp, open, high, low, close, volume]
    #https://kite.zerodha.com/connect/login?api_key=kji5cp71pkds249r