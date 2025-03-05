alter table "public"."user_chat" add constraint "user_chat_chat_uuid_textContent_user_query_key" unique ("chat_uuid", "textContent_user_query");
