-- Create company_solvency_ratios table
CREATE TABLE "company_solvency_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "yrc" integer,
  "co_code" integer,
  "solvency_totaldebttoequityratio" numeric,
  "solvency_totaldebttoequityratio_totaldebt" numeric,
  "solvency_totaldebttoequityratio_networth" numeric,
  "solvency_interestcoverageratio" numeric,
  "solvency_interestcoverageratio_ebit" numeric,
  "solvency_interestcoverageratio_interestpayments" numeric,
  "solvency_currentratio" numeric,
  "solvency_currentratio_currentasset" numeric,
  "solvency_currentratio_currentliabilities" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_solvency_ratios" add constraint "company_solvency_ratios_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_solvency_ratios_co_code" on "public"."company_solvency_ratios" using btree ("co_code");
