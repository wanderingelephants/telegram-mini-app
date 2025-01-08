curl -X POST "http://localhost:8000/summarizeFile" \
     -H "Content-Type: application/json" \
     -d '{
       "file_path": "07-Jan-2025/concord.txt",
       "output_file_path": "07-Jan-2025/concord_output.json"
     }'