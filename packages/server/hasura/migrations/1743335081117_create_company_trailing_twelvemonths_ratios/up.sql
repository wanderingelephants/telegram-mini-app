-- Create company_trailing_twelvemonths_ratios table
CREATE TABLE "company_trailing_twelvemonths_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "ttmason" integer ,
  "co_code" integer  not null,
  "record_date" date ,
  "mcap" numeric ,
  "ev" numeric ,
  "pe" numeric ,
  "pbv" numeric ,
  "divyield" numeric ,
  "eps" numeric ,
  "bookvalue" numeric ,
  "roa_ttm" numeric ,
  "roe_ttm" numeric ,
  "roce_ttm" numeric ,
  "ebit_ttm" numeric ,
  "ebitda_ttm" numeric ,
  "ev_sales_ttm" numeric ,
  "ev_ebitda_ttm" numeric ,
  "netincomemargin_ttm" numeric ,
  "grossincomemargin_ttm" numeric ,
  "assetturnover_ttm" numeric ,
  "currentratio_ttm" numeric ,
  "debt_equity_ttm" numeric ,
  "sales_totalassets_ttm" numeric ,
  "netdebt_ebitda_ttm" numeric ,
  "ebitda_margin_ttm" numeric ,
  "totalshareholdersequity_ttm" numeric ,
  "shorttermdebt_ttm" numeric ,
  "longtermdebt_ttm" numeric ,
  "sharesoutstanding" numeric ,
  "epsdiluted" numeric ,
  "netsales" numeric ,
  "netprofit" numeric ,
  "annualdividend" numeric ,
  "cogs" numeric ,
  "pegratio_ttm" numeric ,
  "dividendpayout_ttm" numeric ,
  "industry_pe" numeric ,
  "isconsolidated" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_trailing_twelvemonths_ratios" add constraint "u_company_trailing_twelvemonths_ratios" unique ("ttmason", "co_code", "isconsolidated");
CREATE INDEX "idx_company_trailing_twelvemonths_ratios_ttmason" on "public"."company_trailing_twelvemonths_ratios" using btree ("ttmason");
CREATE INDEX "idx_company_trailing_twelvemonths_ratios_co_code" on "public"."company_trailing_twelvemonths_ratios" using btree ("co_code");
CREATE INDEX "idx_company_trailing_twelvemonths_ratios_isconsolidated" on "public"."company_trailing_twelvemonths_ratios" using btree ("isconsolidated");
