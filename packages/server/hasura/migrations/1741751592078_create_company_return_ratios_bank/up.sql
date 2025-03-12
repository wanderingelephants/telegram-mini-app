-- Create company_return_ratios_bank table
CREATE TABLE "company_return_ratios_bank" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "co_code" integer ,
  "return_roe" numeric ,
  "return_roe_netprofit" numeric ,
  "return_roe_networth" numeric ,
  "return_ro_assets" numeric ,
  "return_ro_assets_netprofit" numeric ,
  "return_ro_assets_totalfixedassets" numeric ,
  "return_netinterestmargin" numeric ,
  "return_yieldonadvances" numeric ,
  "return_yieldonadvances_interestearned" numeric ,
  "return_yieldonadvances_advances" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_return_ratios_bank_co_code_index" on "public"."company_return_ratios_bank" using btree ("co_code");
