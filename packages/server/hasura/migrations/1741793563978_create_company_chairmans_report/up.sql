-- Create company_chairmans_report table
CREATE TABLE "company_chairmans_report" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "lname" text,
  "chairreport" text,
  "yr" integer
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_chairmans_report" add constraint "company_chairmans_report_co_code" unique ("co_code");
CREATE INDEX "idx_company_chairmans_report_co_code" on "public"."company_chairmans_report" using btree ("co_code");
