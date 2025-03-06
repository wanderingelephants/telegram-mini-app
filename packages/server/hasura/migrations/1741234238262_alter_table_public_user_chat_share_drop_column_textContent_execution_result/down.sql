alter table "public"."user_chat_share" alter column "textContent_execution_result" drop not null;
alter table "public"."user_chat_share" add column "textContent_execution_result" text;
