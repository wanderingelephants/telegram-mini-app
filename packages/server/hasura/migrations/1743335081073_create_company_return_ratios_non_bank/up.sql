-- Create company_return_ratios_non_bank table
CREATE TABLE "company_return_ratios_non_bank" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "co_code" integer  not null,
  "return_roe" numeric ,
  "return_roe_netprofit" numeric ,
  "return_roe_networth" numeric ,
  "return_roce" numeric ,
  "return_roce_ebit" numeric ,
  "return_roce_capitalemployed" numeric ,
  "return_returnonassets" numeric ,
  "return_roa_netprofit" numeric ,
  "return_roa_totalfixedassets" numeric ,
  "isconsolidated" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_return_ratios_non_bank" add constraint "u_company_return_ratios_non_bank" unique ("yrc", "month", "quarter", "year", "co_code", "isconsolidated");
CREATE INDEX "idx_company_return_ratios_non_bank_yrc" on "public"."company_return_ratios_non_bank" using btree ("yrc");
CREATE INDEX "idx_company_return_ratios_non_bank_month" on "public"."company_return_ratios_non_bank" using btree ("month");
CREATE INDEX "idx_company_return_ratios_non_bank_quarter" on "public"."company_return_ratios_non_bank" using btree ("quarter");
CREATE INDEX "idx_company_return_ratios_non_bank_year" on "public"."company_return_ratios_non_bank" using btree ("year");
CREATE INDEX "idx_company_return_ratios_non_bank_co_code" on "public"."company_return_ratios_non_bank" using btree ("co_code");
CREATE INDEX "idx_company_return_ratios_non_bank_isconsolidated" on "public"."company_return_ratios_non_bank" using btree ("isconsolidated");
