alter table "public"."user_chat_share" alter column "textContent_assistant_response" drop not null;
alter table "public"."user_chat_share" add column "textContent_assistant_response" text;
