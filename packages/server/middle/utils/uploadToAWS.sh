#!/bin/bash

PREFS_FILE="$HOME/Library/Application Support/Google/Chrome/Default/Preferences"

# Backup original Preferences file
cp "$PREFS_FILE" "$PREFS_FILE.bak"

# --- CONFIGURATION ---
#downloadFolder=~/Downloads
baseFolder=~/announcementsnse
#indices=("equities" "sme")
indices=("sme")
#yesterday=$(date -v -1d +"%d-%m-%Y")
yesterday=16-02-2025
#folderDate=$(date -v -1d +"%Y/%m/%d")
folderDate=2025/02/16
localSavePath="$baseFolder/pdfs/$folderDate"

downloadFolder="$HOME/baseFolder/$folderDate/pdfs"
mkdir -p "$downloadFolder"
jq --arg path "$downloadFolder" '.savefile.default_directory = $path' "$PREFS_FILE" > "$PREFS_FILE.tmp" && mv "$PREFS_FILE.tmp" "$PREFS_FILE"

open -a "Google Chrome"

# Wait a few seconds for Chrome to load settings
sleep 5

# --- STEP 1: Open NSE India in Chrome to establish cookies ---
open -a "Google Chrome" "https://www.nseindia.com"
sleep 10  # Allow time for cookies to be set

# --- STEP 2: Download CSVs ---
for index in "${indices[@]}"; do
    csvUrl="https://www.nseindia.com/api/corporate-announcements?index=$index&from_date=$yesterday&to_date=$yesterday&csv=true"

    # Open the CSV URL in Chrome (initiates download)
    open -a "Google Chrome" "$csvUrl"
    sleep 5  # Give some time for download

    # Move the downloaded CSV to the correct folder
    csvFile="$downloadFolder/CF-AN-$index-$yesterday-to-$yesterday.csv"
    newCsvPath=$csvFile
    #"$baseFolder/$folderDate/$index/announcements_$yesterday.csv"

    mkdir -p "$(dirname "$newCsvPath")"
    
    if [[ -f "$csvFile" ]]; then
        mv "$csvFile" "$newCsvPath"
    else
        echo "CSV file not found for $index!"
        continue
    fi

    # --- STEP 3: Extract PDF links and Download them ---
    tail -n +2 "$newCsvPath" | awk -F ',' '{print $NF}' | while read -r attachmentUrl; do
    cleanUrl=$(echo "$attachmentUrl" | tr -d '"')

    if [[ "$cleanUrl" == http* ]]; then
        echo "Downloading via Chrome: $cleanUrl"
        open -a "Google Chrome" "$cleanUrl"
        sleep 1  # Small delay to avoid overwhelming
    else
        echo "Skipping invalid URL: $cleanUrl"
    fi
    done

    # Wait for downloads to complete (adjust time as needed)
    sleep 60  

    # Restore original Chrome Preferences
    mv "$PREFS_FILE.bak" "$PREFS_FILE"

    # Restart Chrome to apply original settings
    pkill "Google Chrome"
    open -a "Google Chrome"

    echo "Chrome download folder restored to default."


done

# --- STEP 4: Move Downloaded PDFs to the Local Folder ---
sleep 30  # Allow downloads to complete
mv "$downloadFolder"/*.pdf "$localSavePath/" 2>/dev/null

# --- STEP 5: Upload to AWS S3 using Node.js ---
cd ~/telegram-mini-app/packages/server/middle
node --env-file=.env utils/s3Upload.js "$localSavePath"

# --- STEP 6: Cleanup ---
find "$baseFolder/pdfs" -type d -mtime +15 -exec rm -rf {} \;
find "$downloadFolder" -type f -name "*.pdf" -mtime +1 -delete  # Remove leftover PDFs in Downloads

echo "Task completed successfully!"
