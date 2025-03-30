-- Create company_nine_months_results table
CREATE TABLE "company_nine_months_results" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "isconsolidated" boolean ,
  "key_category" text ,
  "key" text ,
  "value" numeric ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "rowno" integer ,
  "rid" integer 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_nine_months_results" add constraint "u_company_nine_months_results" unique ("co_code", "isconsolidated", "key_category", "key", "month", "quarter", "year", "rowno", "rid");
CREATE INDEX "idx_company_nine_months_results_co_code" on "public"."company_nine_months_results" using btree ("co_code");
CREATE INDEX "idx_company_nine_months_results_isconsolidated" on "public"."company_nine_months_results" using btree ("isconsolidated");
CREATE INDEX "idx_company_nine_months_results_key_category" on "public"."company_nine_months_results" using btree ("key_category");
CREATE INDEX "idx_company_nine_months_results_key" on "public"."company_nine_months_results" using btree ("key");
CREATE INDEX "idx_company_nine_months_results_month" on "public"."company_nine_months_results" using btree ("month");
CREATE INDEX "idx_company_nine_months_results_quarter" on "public"."company_nine_months_results" using btree ("quarter");
CREATE INDEX "idx_company_nine_months_results_year" on "public"."company_nine_months_results" using btree ("year");
CREATE INDEX "idx_company_nine_months_results_rowno" on "public"."company_nine_months_results" using btree ("rowno");
CREATE INDEX "idx_company_nine_months_results_rid" on "public"."company_nine_months_results" using btree ("rid");
