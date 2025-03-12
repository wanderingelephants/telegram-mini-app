-- Create company_notes_to_account table
CREATE TABLE "company_notes_to_account" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "lname" text,
  "memo" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_notes_to_account" add constraint "company_notes_to_account_co_code" unique ("co_code");
CREATE INDEX "idx_company_notes_to_account_co_code" on "public"."company_notes_to_account" using btree ("co_code");
