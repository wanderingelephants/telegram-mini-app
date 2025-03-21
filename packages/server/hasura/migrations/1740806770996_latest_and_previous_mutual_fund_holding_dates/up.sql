CREATE OR REPLACE VIEW latest_and_previous_mutual_fund_holding_dates AS
WITH ranked_dates AS (
    SELECT 
        mutual_fund_id,
        reporting_date,
        DENSE_RANK() OVER (PARTITION BY mutual_fund_id ORDER BY reporting_date DESC) AS date_rank
    FROM 
        mutual_fund_holdings
)
SELECT 
    mutual_fund_id,
    MAX(CASE WHEN date_rank = 1 THEN reporting_date END) AS latest_reporting_date,
    MAX(CASE WHEN date_rank = 2 THEN reporting_date END) AS previous_reporting_date
FROM 
    ranked_dates
WHERE 
    date_rank <= 2
GROUP BY 
    mutual_fund_id;
