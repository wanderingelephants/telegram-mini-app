function analyze(mutual_fund_data) {
    const parseDate = (dateStr) => {
    const months = {'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11};
    const [day, month, year] = dateStr.split('-');
    return new Date(year, months[month], day);
    };
    
    // Filter for ICICI Bank holdings
    const targetStock = 'ICICI Bank';
    const filtered = mutual_fund_data.filter(entry =>
    entry.stock_name.toLowerCase() === targetStock.toLowerCase()
    );
    
    // Group by fund and sort entries by date
    const fundGroups = filtered.reduce((acc, entry) => {
    const fund = entry.fund_name;
    acc[fund] = acc[fund] || [];
    acc[fund].push({
    date: parseDate(entry.holding_reporting_date),
    percentage: parseFloat(entry.stock_holding_percentage)
    });
    return acc;
    }, {});
    
    // Find funds with increased holdings
    const results = [];
    Object.entries(fundGroups).forEach(([fund, entries]) => {
    entries.sort((a, b) => b.date - a.date);
    if (entries.length >= 2) {
    const [latest, previous] = entries.slice(0, 2);
    if (latest.percentage > previous.percentage) {
    results.push(fund);
    }
    }
    });
    
    return results;
    }
const mutual_fund_data = [
	{
		"fund_name" : "HDFC Small Cap Fund",
		"stock_name" : "ICICI Bank",
		"stock_holding_percentage": "3.4", 
		"holding_reporting_date": "31-Dec-2024"
	},
    {
		"fund_name" : "HDFC Small Cap Fund",
		"stock_name" : "ICICI Bank",
		"stock_holding_percentage": "5.4", 
		"holding_reporting_date": "31-Nov-2023"
	}
]   
const results = analyze(mutual_fund_data) 
console.log(results)