alter table "public"."stock" add column "updated_at" timestamptz
 null default now();
