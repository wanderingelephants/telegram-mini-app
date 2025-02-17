alter table "public"."portfolio_stocks" add constraint "portfolio_stocks_user_id_stock_id_key" unique ("user_id", "stock_id");
