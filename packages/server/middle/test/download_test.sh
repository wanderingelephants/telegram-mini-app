curl -X POST http://localhost:3000/api/nse/download \
-H "Content-Type: application/json" \
-d '{
  "baseUrl": "https://www.nseindia.com",
  "urlSuffix": "/api/corporate-announcements?index=sme&from_date=02-01-2025&to_date=03-01-2025&csv=true",
  "downloadFileName": "02-01-2025_03-01-2025-Announcements_SME.csv"
}'
#/api/etf
#/api/corporate-announcements?index=sme&from_date=02-01-2025&to_date=03-01-2025&csv=true