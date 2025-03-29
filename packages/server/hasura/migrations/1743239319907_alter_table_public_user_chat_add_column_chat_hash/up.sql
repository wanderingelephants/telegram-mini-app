alter table "public"."user_chat" add column "chat_hash" text
 not null unique;
