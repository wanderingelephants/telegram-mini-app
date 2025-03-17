const abbreviations = {
    "'": "",
    "`": "",
    "\"": "",
    "date": "record_date",
    "net": "net",
    "profit": "prft",
    "from": "",
    "ordinary": "ordnry",
    "activities": "actvts",
    "discontinued": "discontd",
    "operations": "ops",
    "after": "aft",
    "before": "b4",
    "income": "inc",
    "finance": "fin",
    "expenses": "exp",
    "/": "or",
    ":": ""
  };
  
  function abbreviateColumnName(columnName, maxLength = 63) {
    // Convert spaces to underscores
    columnName =  columnName.trim()
    .toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
              // Keep 'or' as is (for cases like "sales_or_income")

    columnName = columnName.toLowerCase().replace(/\s+/g, "_");
    columnName = columnName.replace(/_+/g, "_");
    // Split into words and apply abbreviations
    let words = columnName.split("_").map(word => abbreviations[word] || word);
  
    // Join back into a string
    let result = words.join("_");
    // Truncate if still too long
    if (result.length > maxLength) {
      console.log("Trucating", result)
      result = result.substring(0, maxLength);
      console.log("Truncated", result)
      
    }
  
    return result;
  }
  module.exports = abbreviateColumnName