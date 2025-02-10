alter table "public"."stock_announcements" alter column "announcement_sentiment" drop not null;
alter table "public"."stock_announcements" add column "announcement_sentiment" text;
