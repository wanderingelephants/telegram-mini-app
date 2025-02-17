alter table "public"."portfolio_mutual_funds" add constraint "portfolio_mutual_funds_user_id_mutual_fund_id_key" unique ("user_id", "mutual_fund_id");
