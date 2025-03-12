-- Create company_return_ratios_non_bank table
CREATE TABLE "company_return_ratios_non_bank" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "co_code" integer ,
  "return_roe" numeric ,
  "return_roe_netprofit" numeric ,
  "return_roe_networth" numeric ,
  "return_roce" numeric ,
  "return_roce_ebit" numeric ,
  "return_roce_capitalemployed" numeric ,
  "return_returnonassets" numeric ,
  "return_roa_netprofit" numeric ,
  "return_roa_totalfixedassets" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_return_ratios_non_bank_co_code_index" on "public"."company_return_ratios_non_bank" using btree ("co_code");
