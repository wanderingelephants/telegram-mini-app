CREATE  INDEX "insider_trades_stock_index" on
  "public"."insider_trades" using btree ("stock_id");
