create table mutual_fund()

drop view stock_holdings

create view stock_holdings_in_mutual_fund as 
select mf.mutual_fund_name, mf.mutual_fund_star_rating, mf.mutual_fund_category, mf.percentage_annualized_returns_for_1_year_period as mutual_fund_returns,holding.stock_name as company_stock_name, 
holding.stock_sector, holding.stock_holding_in_percentage, holding.reporting_date
from mutual_fund mf, mutual_fund_holdings holding
where mf.id = holding.mutual_fund_id