-- Create company_yearly_ratios table
CREATE TABLE "company_yearly_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yearend" integer ,
  "co_code" integer  not null,
  "mcap" numeric ,
  "ev" numeric ,
  "pe" numeric ,
  "pbv" numeric ,
  "divyield" numeric ,
  "dividendpayout" numeric ,
  "eps" numeric ,
  "bookvalue" numeric ,
  "roa" numeric ,
  "roe" numeric ,
  "roce" numeric ,
  "ebit" numeric ,
  "ebitda" numeric ,
  "ev_sales" numeric ,
  "ev_ebitda" numeric ,
  "netincomemargin" numeric ,
  "grossincomemargin" numeric ,
  "assetturnover" numeric ,
  "currentratio" numeric ,
  "debt_equity" numeric ,
  "fcf_margin" numeric ,
  "sales_totalasset" numeric ,
  "netdebt_fcf" numeric ,
  "netdebt_ebitda" numeric ,
  "ebitda_margin" numeric ,
  "totalshareholdersequity" numeric ,
  "shorttermdebt" numeric ,
  "longtermdebt" numeric ,
  "sharesoutstanding" numeric ,
  "netsales" numeric ,
  "netprofit" numeric ,
  "annualdividend" numeric ,
  "cogs" numeric ,
  "retainedearnings" numeric ,
  "isconsolidated" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_yearly_ratios" add constraint "u_company_yearly_ratios" unique ("yearend", "co_code", "isconsolidated");
CREATE INDEX "idx_company_yearly_ratios_yearend" on "public"."company_yearly_ratios" using btree ("yearend");
CREATE INDEX "idx_company_yearly_ratios_co_code" on "public"."company_yearly_ratios" using btree ("co_code");
CREATE INDEX "idx_company_yearly_ratios_isconsolidated" on "public"."company_yearly_ratios" using btree ("isconsolidated");
