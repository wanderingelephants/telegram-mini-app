alter table "public"."user_chat" alter column "recordHash" drop not null;
alter table "public"."user_chat" add column "recordHash" text;
