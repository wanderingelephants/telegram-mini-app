-- Create company_valuation_ratios table
CREATE TABLE "company_valuation_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "yrc" integer,
  "co_code" integer,
  "pe" numeric,
  "price_bookvalue" numeric,
  "dividendyield" numeric,
  "ev_ebitda" numeric,
  "mcap_sales" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_valuation_ratios" add constraint "company_valuation_ratios_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_valuation_ratios_co_code" on "public"."company_valuation_ratios" using btree ("co_code");
