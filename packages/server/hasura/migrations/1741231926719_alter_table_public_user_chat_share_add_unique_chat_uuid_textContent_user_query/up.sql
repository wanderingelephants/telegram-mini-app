alter table "public"."user_chat_share" add constraint "user_chat_share_chat_uuid_textContent_user_query_key" unique ("chat_uuid", "textContent_user_query");
