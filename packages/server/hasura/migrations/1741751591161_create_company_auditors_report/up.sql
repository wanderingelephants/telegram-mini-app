-- Create company_auditors_report table
CREATE TABLE "company_auditors_report" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "lname" text ,
  "symbol" text ,
  "memo" text ,
  "yr" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_auditors_report_co_code_index" on "public"."company_auditors_report" using btree ("co_code");
