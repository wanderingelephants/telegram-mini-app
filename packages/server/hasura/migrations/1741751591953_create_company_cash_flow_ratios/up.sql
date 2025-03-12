-- Create company_cash_flow_ratios table
CREATE TABLE "company_cash_flow_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "co_code" integer ,
  "cashflowpershare" numeric ,
  "pricetocashflowratio" numeric ,
  "freecashflowpershare" numeric ,
  "pricetofreecashflow" numeric ,
  "freecashflowyield" numeric ,
  "salestocashflowratio" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_cash_flow_ratios_co_code_index" on "public"."company_cash_flow_ratios" using btree ("co_code");
