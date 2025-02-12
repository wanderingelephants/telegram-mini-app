alter table "public"."stock_announcements" add column "updated_at" timestamptz
 null default now();
