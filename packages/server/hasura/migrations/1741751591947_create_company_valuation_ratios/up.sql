-- Create company_valuation_ratios table
CREATE TABLE "company_valuation_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "co_code" integer ,
  "pe" numeric ,
  "price_bookvalue" numeric ,
  "dividendyield" numeric ,
  "ev_ebitda" numeric ,
  "mcap_sales" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_valuation_ratios_co_code_index" on "public"."company_valuation_ratios" using btree ("co_code");
