-- Create company_financial_stability_ratios table
CREATE TABLE "company_financial_stability_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "yrc" integer,
  "co_code" integer,
  "totaldebt_equity" numeric,
  "currentratio" numeric,
  "quickratio" numeric,
  "interestcover" numeric,
  "totaldebt_mcap" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_financial_stability_ratios" add constraint "company_financial_stability_ratios_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_financial_stability_ratios_co_code" on "public"."company_financial_stability_ratios" using btree ("co_code");
