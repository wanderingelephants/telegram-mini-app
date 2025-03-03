CREATE  INDEX "stock_price_stock_id" on
  "public"."stock_price_daily" using btree ("stock_id");
