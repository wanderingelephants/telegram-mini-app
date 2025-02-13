alter table "public"."mutual_fund_holdings"
  add constraint "mutual_fund_holdings_stock_id_fkey"
  foreign key ("stock_id")
  references "public"."stock_mf"
  ("id") on update restrict on delete restrict;
