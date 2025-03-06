CREATE  INDEX "user_chat_share_uuid_idxx" on
  "public"."user_chat_share" using btree ("chat_uuid");
