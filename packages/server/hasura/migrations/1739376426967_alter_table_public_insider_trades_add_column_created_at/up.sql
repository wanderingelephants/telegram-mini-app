alter table "public"."insider_trades" add column "created_at" timestamptz
 null default now();
