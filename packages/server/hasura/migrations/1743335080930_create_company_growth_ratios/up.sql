-- Create company_growth_ratios table
CREATE TABLE "company_growth_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "co_code" integer  not null,
  "netsalesgrowth" numeric ,
  "ebitdagrowth" numeric ,
  "ebitgrowth" numeric ,
  "patgrowth" numeric ,
  "coreoperatingincomegrowth" numeric ,
  "netprofitgrowth" numeric ,
  "bvpsgrowth" numeric ,
  "advancesgrowth" numeric ,
  "eps" numeric ,
  "isconsolidated" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_growth_ratios" add constraint "u_company_growth_ratios" unique ("yrc", "month", "quarter", "year", "co_code", "isconsolidated");
CREATE INDEX "idx_company_growth_ratios_yrc" on "public"."company_growth_ratios" using btree ("yrc");
CREATE INDEX "idx_company_growth_ratios_month" on "public"."company_growth_ratios" using btree ("month");
CREATE INDEX "idx_company_growth_ratios_quarter" on "public"."company_growth_ratios" using btree ("quarter");
CREATE INDEX "idx_company_growth_ratios_year" on "public"."company_growth_ratios" using btree ("year");
CREATE INDEX "idx_company_growth_ratios_co_code" on "public"."company_growth_ratios" using btree ("co_code");
CREATE INDEX "idx_company_growth_ratios_isconsolidated" on "public"."company_growth_ratios" using btree ("isconsolidated");
