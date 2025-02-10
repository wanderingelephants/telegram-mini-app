CREATE  INDEX "insider_trades_transaction_type_index" on
  "public"."insider_trades" using btree ("transaction_type");
