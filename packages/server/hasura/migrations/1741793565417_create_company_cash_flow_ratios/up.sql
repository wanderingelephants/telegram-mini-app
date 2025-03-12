-- Create company_cash_flow_ratios table
CREATE TABLE "company_cash_flow_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "yrc" integer,
  "co_code" integer,
  "cashflowpershare" numeric,
  "pricetocashflowratio" numeric,
  "freecashflowpershare" numeric,
  "pricetofreecashflow" numeric,
  "freecashflowyield" numeric,
  "salestocashflowratio" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_cash_flow_ratios" add constraint "company_cash_flow_ratios_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_cash_flow_ratios_co_code" on "public"."company_cash_flow_ratios" using btree ("co_code");
