curl "https://api.kite.trade/instruments" -o instruments.csv \
  -H "X-Kite-Version: 3" \
  -H "Authorization: token <apikey>:<access_token>"


curl "https://api.kite.trade/instruments/historical/136413956/day?from=2025-02-01+09:15:00&to=2025-02-12+15:30:00" \
    -H "X-Kite-Version: 3" \
    -H "Authorization: token <apikey>:<access_token>"