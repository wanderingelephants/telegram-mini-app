-- Create company_efficiency_ratios table
CREATE TABLE "company_efficiency_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "co_code" integer  not null,
  "fixedcapitals_sales" numeric ,
  "receivabledays" numeric ,
  "inventorydays" numeric ,
  "payabledays" numeric ,
  "costincomeratio" numeric ,
  "corecostincomeratio" numeric ,
  "operatingcoststoassets" numeric ,
  "isconsolidated" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_efficiency_ratios" add constraint "u_company_efficiency_ratios" unique ("yrc", "month", "quarter", "year", "co_code", "isconsolidated");
CREATE INDEX "idx_company_efficiency_ratios_yrc" on "public"."company_efficiency_ratios" using btree ("yrc");
CREATE INDEX "idx_company_efficiency_ratios_month" on "public"."company_efficiency_ratios" using btree ("month");
CREATE INDEX "idx_company_efficiency_ratios_quarter" on "public"."company_efficiency_ratios" using btree ("quarter");
CREATE INDEX "idx_company_efficiency_ratios_year" on "public"."company_efficiency_ratios" using btree ("year");
CREATE INDEX "idx_company_efficiency_ratios_co_code" on "public"."company_efficiency_ratios" using btree ("co_code");
CREATE INDEX "idx_company_efficiency_ratios_isconsolidated" on "public"."company_efficiency_ratios" using btree ("isconsolidated");
