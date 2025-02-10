CREATE  INDEX "insider_trades_transaction_mode_index" on
  "public"."insider_trades" using btree ("mode_of_transaction");
