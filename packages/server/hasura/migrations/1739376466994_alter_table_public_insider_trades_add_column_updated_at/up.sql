alter table "public"."insider_trades" add column "updated_at" timestamptz
 null default now();
