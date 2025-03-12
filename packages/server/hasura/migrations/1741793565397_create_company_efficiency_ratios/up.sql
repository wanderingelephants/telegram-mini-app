-- Create company_efficiency_ratios table
CREATE TABLE "company_efficiency_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "yrc" integer,
  "co_code" integer,
  "fixedcapitals_sales" numeric,
  "receivabledays" numeric,
  "inventorydays" numeric,
  "payabledays" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_efficiency_ratios" add constraint "company_efficiency_ratios_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_efficiency_ratios_co_code" on "public"."company_efficiency_ratios" using btree ("co_code");
