-- Create company_liquidity_ratios table
CREATE TABLE "company_liquidity_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "co_code" integer  not null,
  "loans_to_deposits" numeric ,
  "cash_to_deposits" numeric ,
  "investment_todeposits" numeric ,
  "incloan_to_deposit" numeric ,
  "credit_to_deposits" numeric ,
  "interestexpended_to_interestearned" numeric ,
  "interestincome_to_totalfunds" numeric ,
  "interestexpended_to_totalfunds" numeric ,
  "casa" numeric ,
  "isconsolidated" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_liquidity_ratios" add constraint "u_company_liquidity_ratios" unique ("yrc", "month", "quarter", "year", "co_code", "isconsolidated");
CREATE INDEX "idx_company_liquidity_ratios_yrc" on "public"."company_liquidity_ratios" using btree ("yrc");
CREATE INDEX "idx_company_liquidity_ratios_month" on "public"."company_liquidity_ratios" using btree ("month");
CREATE INDEX "idx_company_liquidity_ratios_quarter" on "public"."company_liquidity_ratios" using btree ("quarter");
CREATE INDEX "idx_company_liquidity_ratios_year" on "public"."company_liquidity_ratios" using btree ("year");
CREATE INDEX "idx_company_liquidity_ratios_co_code" on "public"."company_liquidity_ratios" using btree ("co_code");
CREATE INDEX "idx_company_liquidity_ratios_isconsolidated" on "public"."company_liquidity_ratios" using btree ("isconsolidated");
