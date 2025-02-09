fromDate="07-02-2025"
toDate="07-02-2025"
index="sme"
data_folder=/var/poc/temp/crypto_buddies/sample/data/nse_announcements

curl -X POST http://localhost:3000/api/nse/announcements \
-H "Content-Type: application/json" \
-d "{
  \"fromDate\": \"$fromDate\",
  \"toDate\": \"$toDate\",
  \"index\": \"$index\"
}"

day=$(echo $fromDate | cut -d'-' -f1)
month=$(echo $fromDate | cut -d'-' -f2)
year=$(echo $fromDate | cut -d'-' -f3)

# Create the formatted folder structure
formattedDate="$year/$month/$day"

curl -X GET "http://localhost:3500/api/processPDFs?inputFolder=$formattedDate&outputFolder=$formattedDate"

./summarize.sh $data_folder/to_text/$formattedDate $data_folder/summaries/$formattedDate