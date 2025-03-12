-- Create company_corporate_governance table
CREATE TABLE "company_corporate_governance" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "record_date" date,
  "corpgov_report" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_corporate_governance" add constraint "company_corporate_governance_co_code" unique ("co_code");
CREATE INDEX "idx_company_corporate_governance_co_code" on "public"."company_corporate_governance" using btree ("co_code");
CREATE INDEX "idx_company_corporate_governance_record_date" on "public"."company_corporate_governance" using btree ("record_date");
