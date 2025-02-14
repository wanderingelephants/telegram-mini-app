alter table "public"."stock_price_daily" add constraint "stock_price_daily_stock_id_price_date_key" unique ("stock_id", "price_date");
