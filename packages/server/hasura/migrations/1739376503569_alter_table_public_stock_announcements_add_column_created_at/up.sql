alter table "public"."stock_announcements" add column "created_at" timestamptz
 null default now();
