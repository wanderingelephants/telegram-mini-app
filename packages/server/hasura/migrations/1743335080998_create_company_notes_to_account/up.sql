-- Create company_notes_to_account table
CREATE TABLE "company_notes_to_account" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "lname" text ,
  "memo" text ,
  "year" integer 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_notes_to_account" add constraint "u_company_notes_to_account" unique ("year");
CREATE INDEX "idx_company_notes_to_account_year" on "public"."company_notes_to_account" using btree ("year");
