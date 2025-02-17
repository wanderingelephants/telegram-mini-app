curl -X POST http://51.158.62.147:3000/api/chat \
-H "Content-Type: application/json" \
-d '{"messages": [], "model": "llama3.2"}'


curl -X POST http://51.158.62.147:3000/api/nse/announcements \
-H "Content-Type: application/json" \
-d '{
  "fromDate": "16-02-2025",
  "toDate": "16-02-2025",
  "index": "sme"
}'
#baseUrl, urlSuffix, etfFileName
curl -X POST http://localhost:3000/api/nse/process \
-H "Content-Type: application/json" \
-d '{
  "baseUrl": "https://www.nseindia.com",
  "urlSuffix": "/api/etf",
  "etfFileName": "2025-01-23.json"
}'

curl -X POST http://localhost:3000/api/mutualfunds/recommend \
-H "Content-Type: application/json" \
-d '{
  "fundList": ["Motilal MOSt Oswal Midcap 100 ETF", "Groww Large Cap Fund - Regular Plan - Growth", "Motilal Oswal Large Cap Fund - Regular Plan - Growth"]
}'
curl -X POST http://localhost:3000/api/mutualfunds/recommend \
-H "Content-Type: application/json" \
-d '{
  "fundList": ["Groww Large Cap Fund - Regular Plan - Growth"]
}'

curl -X POST http://localhost:3000/api/mutualfunds/recommend \
-H "Content-Type: application/json" \
-d '{
  "fundList": [],
  "reverse_match_etf": ["Motilal MOSt Oswal Midcap 100 ETF"]
}'
#/api/etf
#/api/corporate-announcements?index=sme&from_date=02-01-2025&to_date=03-01-2025&csv=true