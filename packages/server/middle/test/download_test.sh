source ../.env

if [ -z "$cmots_api_token" ]; then
    echo "Error: cmots_api_token is not set in the .env file"
    exit 1
fi

# curl -X POST http://51.158.62.147:3000/api/chat \
# -H "Content-Type: application/json" \
# -d '{"messages": [], "model": "llama3.2"}'


# curl -X POST http://51.158.62.147:3000/api/nse/announcements \
# -H "Content-Type: application/json" \
# -d '{
#   "fromDate": "16-02-2025",
#   "toDate": "16-02-2025",
#   "index": "sme"
# }'
# #baseUrl, urlSuffix, etfFileName
# curl -X POST http://51.158.62.147:3000/api/chat/summary \
# -H "Content-Type: application/json" \
# -d '{
#                 "activity": "announcements_summary",
#                 "email": "dummy@dummy.com",
#                 "customData": {
#                     "stock_symbol": "KPEL",
#                     "announcement_date": "2024-02-24",
#                     "attachment": "https://nsearchives.com"
#                 },
#                 "messages": [
#                     {
#                         "role": "user",
#                         "content": "This is the Quarterly Results where we have shown 100% yoy growth in  revenue and 50% yoy growht in PAT. Looking to capex  in next 4 quarters"
#                     }
#                 ]
#             }'

# curl -X POST http://localhost:3000/api/mutualfunds/recommend \
# -H "Content-Type: application/json" \
# -d '{
#   "fundList": ["Motilal MOSt Oswal Midcap 100 ETF", "Groww Large Cap Fund - Regular Plan - Growth", "Motilal Oswal Large Cap Fund - Regular Plan - Growth"]
# }'
# curl -X POST http://localhost:3000/api/mutualfunds/recommend \
# -H "Content-Type: application/json" \
# -d '{
#   "fundList": ["Groww Large Cap Fund - Regular Plan - Growth"]
# }'

# curl -X POST http://localhost:3000/api/mutualfunds/recommend \
# -H "Content-Type: application/json" \
# -d '{
#   "fundList": [],
#   "reverse_match_etf": ["Motilal MOSt Oswal Midcap 100 ETF"]
# }'
# #/api/etf
# #/api/corporate-announcements?index=sme&from_date=02-01-2025&to_date=03-01-2025&csv=true


# curl -X GET http://jwttoken.cmots.com/Aidea/api/SectorWiseComp/6 \
# -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFpZGVhIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQxMTYzNjA3LCJleHAiOjE3NDI0NTk2MDcsImlhdCI6MTc0MTE2MzYwNywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDE5MSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAxOTEifQ.BcOEW6MX2D-lDBPaOOAqLcvrTz3kLW8G08bAZaqEoA0"


# curl -X GET http://jwttoken.cmots.com/Aidea/api/IndexWiseComp/75348 \
# -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFpZGVhIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQxMTYzNjA3LCJleHAiOjE3NDI0NTk2MDcsImlhdCI6MTc0MTE2MzYwNywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDE5MSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAxOTEifQ.BcOEW6MX2D-lDBPaOOAqLcvrTz3kLW8G08bAZaqEoA0"


# curl -X GET http://jwttoken.cmots.com/Aidea/api/Today-Results \
# -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFpZGVhIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQxMTYzNjA3LCJleHAiOjE3NDI0NTk2MDcsImlhdCI6MTc0MTE2MzYwNywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDE5MSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAxOTEifQ.BcOEW6MX2D-lDBPaOOAqLcvrTz3kLW8G08bAZaqEoA0"


# curl -X GET http://jwttoken.cmots.com/Aidea/api/GroupMaster/NSE \
# -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFpZGVhIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQxMTYzNjA3LCJleHAiOjE3NDI0NTk2MDcsImlhdCI6MTc0MTE2MzYwNywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDE5MSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAxOTEifQ.BcOEW6MX2D-lDBPaOOAqLcvrTz3kLW8G08bAZaqEoA0"


# curl -X GET http://jwttoken.cmots.com/Aidea/api/QuarterlyResults/476/C \
# -H "Authorization: Bearer $cmots_api_token" | jq -r '.data[].COLUMNNAME'



curl -X GET http://jwttoken.cmots.com/Aidea/api/CashFlow/93/S \
-H "Authorization: Bearer $cmots_api_token" 

#| jq -r '.data[].COLUMNNAME'