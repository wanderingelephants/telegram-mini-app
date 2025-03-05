alter table "public"."user_chat" alter column "role_id" drop not null;
alter table "public"."user_chat" add column "role_id" int4;
