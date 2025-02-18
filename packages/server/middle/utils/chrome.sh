#!/bin/bash

# Open the NSE India website in Chrome
open -a "Google Chrome" "https://www.nseindia.com"
sleep 10  # Wait for cookies to be set
# Open the CSV download URL
open -a "Google Chrome" "https://www.nseindia.com/api/corporate-announcements?index=equities&from_date=16-02-2025&to_date=16-02-2025&csv=true"
