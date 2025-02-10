CREATE  INDEX "insider_trades_category_index" on
  "public"."insider_trades" using btree ("category_of_insider");
