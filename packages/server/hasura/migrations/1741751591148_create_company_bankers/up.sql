-- Create company_bankers table
CREATE TABLE "company_bankers" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "lname" text ,
  "bnk_name" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_bankers_co_code_index" on "public"."company_bankers" using btree ("co_code");
