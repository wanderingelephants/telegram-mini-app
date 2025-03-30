-- Create company_solvency_ratios table
CREATE TABLE "company_solvency_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "co_code" integer  not null,
  "solvency_totaldebttoequityratio" numeric ,
  "solvency_totaldebttoequityratio_totaldebt" numeric ,
  "solvency_totaldebttoequityratio_networth" numeric ,
  "solvency_interestcoverageratio" numeric ,
  "solvency_interestcoverageratio_ebit" numeric ,
  "solvency_interestcoverageratio_interestpayments" numeric ,
  "solvency_currentratio" numeric ,
  "solvency_currentratio_currentasset" numeric ,
  "solvency_currentratio_currentliabilities" numeric ,
  "isconsolidated" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_solvency_ratios" add constraint "u_company_solvency_ratios" unique ("yrc", "month", "quarter", "year", "co_code", "isconsolidated");
CREATE INDEX "idx_company_solvency_ratios_yrc" on "public"."company_solvency_ratios" using btree ("yrc");
CREATE INDEX "idx_company_solvency_ratios_month" on "public"."company_solvency_ratios" using btree ("month");
CREATE INDEX "idx_company_solvency_ratios_quarter" on "public"."company_solvency_ratios" using btree ("quarter");
CREATE INDEX "idx_company_solvency_ratios_year" on "public"."company_solvency_ratios" using btree ("year");
CREATE INDEX "idx_company_solvency_ratios_co_code" on "public"."company_solvency_ratios" using btree ("co_code");
CREATE INDEX "idx_company_solvency_ratios_isconsolidated" on "public"."company_solvency_ratios" using btree ("isconsolidated");
