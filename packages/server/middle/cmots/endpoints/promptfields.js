const fs = require("fs")
const path = require("path")

function getCategory(array_name) {
    if (array_name.indexOf("_ratio") > -1) return "Ratio Signals"
    else if (array_name.indexOf("company_balance_sheet") > -1 || array_name.indexOf("company_cash_flow") > -1 || array_name.indexOf("company_profit_and_loss") > -1) return "Financial Signals"
    else if  (array_name.indexOf("_fifty_two_week_") > -1 || array_name.indexOf("_price") > -1) return "Price/Volume Signals"
    else if  (array_name.indexOf("substantial") > -1||array_name.indexOf("insider_trading") > -1||array_name.indexOf("_deals") > -1||array_name.indexOf("_shareholding") > -1) return "Shareholding Signals"
    else return "Subjective Signals"

    /*const mapping = {
      "company_balance_sheet": "financials",
      "company_profit_loss": "financials",
      "margin_ratios": "ratios",
      "valuation_ratios": "ratios"
    };
    return mapping[array_name] || "other"; */
}
function transformData(inputArray) {
    return inputArray.reduce((categorized, item) => {
      if (!item.fields || item.fields.length === 0) return categorized; // Skip items without fields
  
      const category = getCategory(item.array_name); // Get the category dynamically
      let datasetName = item.array_name
      datasetName = datasetName.replace("shareholding_pattern_", "")
      datasetName = datasetName.replace(/^company_/, '') // Remove 'company_' prefix
        .split('_') // Split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize words
        .join(' '); // Join words with space
  
      let filteredFields;
      if (Array.isArray(item.fields) && typeof item.fields[0] === 'object') {
        filteredFields = Object.keys(item.fields[0]).filter(field => !field.startsWith("company_")); // Extract keys from first object, exclude 'company_'
      } else {
        filteredFields = item.fields.filter(field => typeof field === 'string' && !field.startsWith("company_")); // Exclude fields starting with 'company_'
      }
      
      if (filteredFields.length === 0) return categorized; // Skip if no valid fields remain
      if (datasetName.startsWith("Companies Hitting")) datasetName = datasetName.replace("Companies Hitting", "")
      if (!(datasetName === "Mutual Fund" || datasetName === "Index Wise Companies" || datasetName === "Sector Wise Companies")) filteredFields.unshift("company")
      const transformedItem = {
        dataset_name: datasetName,
        dataset_category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize category
        fields: filteredFields
      };
  
      if (!categorized[category]) {
        categorized[category] = [];
      }
  
      categorized[category].push(transformedItem);
      return categorized;
    }, {});
  }
const route = async (req, res) => {
    
    try{
        const data = fs.readFileSync(path.join(process.env.DATA_ROOT_FOLDER, "prompts_fields.json"), "utf-8")  
        const promptFields = JSON.parse(data)
        console.log("Total", promptFields.length)
        promptFields.push({"array_name": "corporate_announcements", "fields": ["keyword hints (e.g. capex, large orders, preferential offer)"]})
        promptFields.push({"array_name": "chairmans_report", "fields": ["keyword hints"]})
        promptFields.push({"array_name": "directors_report", "fields": ["keyword hints"]})
        promptFields.push({"array_name": "auditors_report", "fields": ["keyword hints"]})
        
        const categorizedArrays = transformData(promptFields)
        //const financials = promptFields.filter(t => t.array_name.indexOf("balancesheet") > -1)
        
        
        res.status(200).json(categorizedArrays)      
    }
    catch(e){
        console.error(e)
        res.status(500).json(e)
    }
    
}
module.exports = route