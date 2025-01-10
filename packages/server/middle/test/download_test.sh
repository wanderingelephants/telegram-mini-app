curl -X POST http://51.158.62.147:3000/api/chat \
-H "Content-Type: application/json" \
-d '{"messages": [], "model": "llama3.2"}'


curl -X POST http://localhost:3000/api/nse/download \
-H "Content-Type: application/json" \
-d '{
  "baseUrl": "https://nsearchives.nseindia.com",
  "urlSuffix": "/corporate/SURANI_03012025182629_RTAintimation03012025.pdf",
  "downloadFileName": "SURANI.pdf"
}'

#/api/etf
#/api/corporate-announcements?index=sme&from_date=02-01-2025&to_date=03-01-2025&csv=true