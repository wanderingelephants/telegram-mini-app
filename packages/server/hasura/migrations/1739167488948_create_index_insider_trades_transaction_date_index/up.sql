CREATE  INDEX "insider_trades_transaction_date_index" on
  "public"."insider_trades" using btree ("transaction_date");
