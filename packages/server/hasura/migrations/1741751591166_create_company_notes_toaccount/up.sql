-- Create company_notes_toaccount table
CREATE TABLE "company_notes_toaccount" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "lname" text ,
  "memo" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_notes_toaccount_co_code_index" on "public"."company_notes_toaccount" using btree ("co_code");
