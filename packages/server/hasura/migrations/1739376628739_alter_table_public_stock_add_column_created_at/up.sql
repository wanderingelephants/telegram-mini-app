alter table "public"."stock" add column "created_at" timestamptz
 null default now();
