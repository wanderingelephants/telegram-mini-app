-- Create company_quarterly_ratio table
CREATE TABLE "company_quarterly_ratio" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "qtrend" integer,
  "co_code" integer,
  "mcap" numeric,
  "ev" numeric,
  "pe" numeric,
  "pbv" numeric,
  "eps" numeric,
  "bookvalue" numeric,
  "ebit" numeric,
  "ebitda" numeric,
  "ev_sales" numeric,
  "ev_ebitda" numeric,
  "netincomemargin" numeric,
  "grossincomemargin" numeric,
  "ebitdamargin" numeric,
  "epsdiluted" numeric,
  "netsales" numeric,
  "netprofit" numeric,
  "cogs" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_quarterly_ratio" add constraint "company_quarterly_ratio_co_code" unique ("co_code");
CREATE INDEX "idx_company_quarterly_ratio_co_code" on "public"."company_quarterly_ratio" using btree ("co_code");
