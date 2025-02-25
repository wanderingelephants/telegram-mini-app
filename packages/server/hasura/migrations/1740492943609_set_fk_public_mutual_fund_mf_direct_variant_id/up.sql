alter table "public"."mutual_fund"
  add constraint "mutual_fund_mf_direct_variant_id_fkey"
  foreign key ("mf_direct_variant_id")
  references "public"."mutual_fund"
  ("id") on update restrict on delete restrict;
