-- Create company_quarterly_ratio table
CREATE TABLE "company_quarterly_ratio" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "qtrend" integer ,
  "co_code" integer ,
  "mcap" numeric ,
  "ev" numeric ,
  "pe" numeric ,
  "pbv" numeric ,
  "eps" numeric ,
  "bookvalue" numeric ,
  "ebit" numeric ,
  "ebitda" numeric ,
  "ev_sales" numeric ,
  "ev_ebitda" numeric ,
  "netincomemargin" numeric ,
  "grossincomemargin" numeric ,
  "ebitdamargin" numeric ,
  "epsdiluted" numeric ,
  "netsales" numeric ,
  "netprofit" numeric ,
  "cogs" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_quarterly_ratio_co_code_index" on "public"."company_quarterly_ratio" using btree ("co_code");
