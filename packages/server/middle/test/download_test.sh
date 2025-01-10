curl -X POST http://51.158.62.147:3000/api/chat \
-H "Content-Type: application/json" \
-d '{"messages": [], "model": "llama3.2"}'


curl -X POST http://51.158.62.147/api/nse/announcements \
-H "Content-Type: application/json" \
-d '{
  "fromDate": "08-01-2025",
  "toDate": "08-01-2025",
  "index": "sme"
}'

#/api/etf
#/api/corporate-announcements?index=sme&from_date=02-01-2025&to_date=03-01-2025&csv=true