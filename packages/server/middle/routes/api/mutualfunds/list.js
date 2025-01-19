const fs = require('fs').promises;
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const route = async (req, res) => {
    try {
        const dbResp = db.prepare('SELECT * FROM mutual_fund order by percentage_annualized_returns_for_3_year_period desc').all();
        const mutualFundList = dbResp.map(m => ({"name": m.mutual_fund_name, "star_rating": m.mutual_fund_star_rating ,"category": m.mutual_fund_category, "aum": m.mutual_fund_assets_under_management, "Returns_3Y": m.percentage_annualized_returns_for_3_year_period}))
        
        res.status(200).json(mutualFundList);
    } catch (e) {
        console.error('Error processing mutual funds data:', e);
        res.status(500).json("Failed to get list");
    }
};

module.exports = route;