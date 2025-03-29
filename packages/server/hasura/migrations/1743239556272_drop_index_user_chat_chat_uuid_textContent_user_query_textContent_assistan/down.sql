CREATE  INDEX "user_chat_chat_uuid_textContent_user_query_textContent_assistan" on
  "public"."user_chat" using btree ("chat_uuid", "textContent_assistant_response", "textContent_user_query");
