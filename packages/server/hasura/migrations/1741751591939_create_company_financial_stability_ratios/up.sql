-- Create company_financial_stability_ratios table
CREATE TABLE "company_financial_stability_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "co_code" integer ,
  "totaldebt_equity" numeric ,
  "currentratio" numeric ,
  "quickratio" numeric ,
  "interestcover" numeric ,
  "totaldebt_mcap" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_financial_stability_ratios_co_code_index" on "public"."company_financial_stability_ratios" using btree ("co_code");
