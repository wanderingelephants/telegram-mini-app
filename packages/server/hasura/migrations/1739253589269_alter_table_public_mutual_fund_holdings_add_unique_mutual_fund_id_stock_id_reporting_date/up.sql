alter table "public"."mutual_fund_holdings" add constraint "mutual_fund_holdings_mutual_fund_id_stock_id_reporting_date_key" unique ("mutual_fund_id", "stock_id", "reporting_date");
