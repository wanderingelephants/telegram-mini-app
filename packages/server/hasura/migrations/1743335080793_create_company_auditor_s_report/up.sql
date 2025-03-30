-- Create company_auditor_s_report table
CREATE TABLE "company_auditor_s_report" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "lname" text ,
  "symbol" text ,
  "memo" text ,
  "yr" integer 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_auditor_s_report" add constraint "u_company_auditor_s_report" unique ("co_code", "yr");
CREATE INDEX "idx_company_auditor_s_report_co_code" on "public"."company_auditor_s_report" using btree ("co_code");
CREATE INDEX "idx_company_auditor_s_report_yr" on "public"."company_auditor_s_report" using btree ("yr");
