-- Create company_quarterly_ratios table
CREATE TABLE "company_quarterly_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "qtrend" integer ,
  "co_code" integer  not null,
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
  "isconsolidated" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_quarterly_ratios" add constraint "u_company_quarterly_ratios" unique ("qtrend", "co_code", "isconsolidated");
CREATE INDEX "idx_company_quarterly_ratios_qtrend" on "public"."company_quarterly_ratios" using btree ("qtrend");
CREATE INDEX "idx_company_quarterly_ratios_co_code" on "public"."company_quarterly_ratios" using btree ("co_code");
CREATE INDEX "idx_company_quarterly_ratios_isconsolidated" on "public"."company_quarterly_ratios" using btree ("isconsolidated");
