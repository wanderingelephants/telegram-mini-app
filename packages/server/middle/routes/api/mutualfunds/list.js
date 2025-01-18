const fs = require('fs').promises;
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const route = async (req, res) => {
    try {
        const dbResp = db.prepare('SELECT * FROM mutual_fund order by percentage_annualized_returns_for_3_year_period desc').all();
        const mutualFundList = dbResp.map(m => ({"name": m.mutual_fund_name, "star_rating": m.mutual_fund_star_rating ,"category": m.mutual_fund_category, "aum": m.mutual_fund_assets_under_management, "Returns_3Y": m.percentage_annualized_returns_for_3_year_period}))
        // Recursive function to search directories
       /* async function searchDirectory(dirPath) {
            const files = await fs.readdir(dirPath);
            for (const file of files) {
                const fullPath = path.join(dirPath, file);
                const stat = await fs.stat(fullPath);
                
                if (stat.isDirectory()) {
                    // If it's a directory, search it recursively
                    await searchDirectory(fullPath);
                } else if (file === 'mutual_funds_data.json') {
                    // If it's our target file, read and parse it
                    const fileContent = await fs.readFile(fullPath, 'utf8');
                    const mfData = JSON.parse(fileContent);
                    
                    // Ensure the data is an array before pushing
                    if (Array.isArray(mfData)) {
                        mutualFundList.push(...mfData);
                    } else {
                        console.warn(`File at ${fullPath} does not contain an array`);
                    }
                }
            }
        }
        
        // Start the search from the data folder
        const dataFolder = process.env.DOWNLOADS + '/moneycontrol';
        if (!dataFolder) {
            throw new Error('DOWNLOADS environment variable is not set');
        }
        
        await searchDirectory(dataFolder);*/
        
        res.status(200).json(mutualFundList);
    } catch (e) {
        console.error('Error processing mutual funds data:', e);
        res.status(500).json("Failed to get list");
    }
};

module.exports = route;