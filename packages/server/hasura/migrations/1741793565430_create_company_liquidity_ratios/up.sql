-- Create company_liquidity_ratios table
CREATE TABLE "company_liquidity_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "yrc" integer,
  "co_code" integer,
  "loans_to_deposits" numeric,
  "cash_to_deposits" numeric,
  "investment_todeposits" numeric,
  "incloan_to_deposit" numeric,
  "credit_to_deposits" numeric,
  "interestexpended_to_interestearned" numeric,
  "interestincome_to_totalfunds" numeric,
  "interestexpended_to_totalfunds" numeric,
  "casa" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_liquidity_ratios" add constraint "company_liquidity_ratios_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_liquidity_ratios_co_code" on "public"."company_liquidity_ratios" using btree ("co_code");
