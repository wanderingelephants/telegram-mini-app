curl -X POST http://localhost:3000/api/nse/download \
-H "Content-Type: application/json" \
-d '{
  "baseUrl": "https://www.nseindia.com",
  "urlSuffix": "/api/etf",
  "downloadFileName": "02-01-2025-ETF.json"
}'