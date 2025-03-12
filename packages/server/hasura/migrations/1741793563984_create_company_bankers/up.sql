-- Create company_bankers table
CREATE TABLE "company_bankers" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "lname" text,
  "bnk_name" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_bankers" add constraint "company_bankers_co_code" unique ("co_code");
CREATE INDEX "idx_company_bankers_co_code" on "public"."company_bankers" using btree ("co_code");
