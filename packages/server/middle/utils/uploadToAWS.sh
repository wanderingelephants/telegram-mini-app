#!/bin/bash

# --- CONFIGURATION ---
PROXY_IP="gate.smartproxy.com"
PROXY_PORT="10001"
PROXY_USER="sp40poazdp"
PROXY_PASS="3xCxz90sTTler8Z=sn"
PROXY_URL="http://$PROXY_USER:$PROXY_PASS@$PROXY_IP:$PROXY_PORT"
#PROXY_URL=http://gate.smartproxy.com:10001:sp40poazdp:3xCxz90sTTler8Z=sn
downloadFolder=~/Downloads
baseFolder=~/announcementsnse
#indices=("equities" "sme")
indices=("sme")
#yesterday=$(date -v -1d +"%d-%m-%Y")
yesterday=16-02-2025
#folderDate=$(date -v -1d +"%Y/%m/%d")
folderDate=2025/02/16
localSavePath="$baseFolder/pdfs/$folderDate"
mkdir -p $localSavePath

# --- STEP 1: Open NSE India in Chrome to establish cookies ---
open -na "Google Chrome" --args --proxy-server="$PROXY_URL" "https://www.nseindia.com"
sleep 10  # Allow time for cookies to be set

download_pdf() {
    local pdf_url="$1"
    local file_name=$(basename "$pdf_url")

    echo "Opening PDF in Chrome with proxy: $pdf_url"
    osascript -e "tell application \"Google Chrome\"
        set tabURL to \"$pdf_url\"
        if (count of windows) = 0 then
            make new window
        end if
        tell front window
            set active tab index to 1
            tell active tab to set URL to tabURL
        end tell
    end tell"

    sleep 3  # Give time for Chrome to load

    osascript -e 'tell application "System Events"
        keystroke "s" using {command down}
        delay 1
        keystroke return
        delay 1
        keystroke return  # Press Enter again in case of filename prompt
    end tell'
    cp "$downloadFolder/$file_name" "$localSavePath/" && rm "$downloadFolder/$file_name"
    echo "Copied $file_name to $localSavePath/"
    #osascript -e 'tell application "Preview"
    #    activate
    #    delay 1
    #    tell application "System Events"
    #        keystroke "s" using {command down}  # Save As
    #        delay 1
    #        keystroke return  # Confirm
    #    end tell
    #end tell'

    # Close Preview app if it's opened
    osascript -e "tell application \"Preview\" to close (every window whose name contains \"$file_name\")" \
        -e "tell application \"Preview\" to quit"
    
}
# --- STEP 2: Download CSVs ---
for index in "${indices[@]}"; do
    csvUrl="https://www.nseindia.com/api/corporate-announcements?index=$index&from_date=$yesterday&to_date=$yesterday&csv=true"

    # Open the CSV URL in Chrome (initiates download)
    open -na "Google Chrome" --args --proxy-server="$PROXY_URL" "$csvUrl"
    sleep 10  # Give some time for download

    # Move the downloaded CSV to the correct folder
    csvFile="$downloadFolder/CF-AN-$index-$yesterday-to-$yesterday.csv"
    #csvFile="$downloadFolder/announcements_$yesterday.csv"
    newCsvPath="$baseFolder/$folderDate/$index/announcements_$yesterday.csv"

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
        download_pdf $cleanUrl
    else
        echo "Skipping invalid URL: $cleanUrl"
    fi

  done


done

# --- STEP 4: Move Downloaded PDFs to the Local Folder ---
#sleep 30  # Allow downloads to complete
#mv "$downloadFolder"/*.pdf "$localSavePath/" 2>/dev/null

# --- STEP 5: Upload to AWS S3 using Node.js ---
cd ~/telegram-mini-app/packages/server/middle
node --env-file=.env utils/s3Upload.js "$localSavePath"

# --- STEP 6: Cleanup ---
#find "$baseFolder/pdfs" -type d -mtime +15 -exec rm -rf {} \;
#find "$downloadFolder" -type f -name "*.pdf" -mtime +1 -delete  # Remove leftover PDFs in Downloads

echo "Task completed successfully!"


#sp40poazdp
#3xCxz90sTTler8Z=sn

#curl -U "sp40poazdp:3xCxz90sTTler8Z=sn" -x "in.smartproxy.com:10000" "https://ip.smartproxy.com/json"


