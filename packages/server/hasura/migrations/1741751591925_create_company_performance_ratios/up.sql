-- Create company_performance_ratios table
CREATE TABLE "company_performance_ratios" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "co_code" integer ,
  "roa" numeric ,
  "roe" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_performance_ratios_co_code_index" on "public"."company_performance_ratios" using btree ("co_code");
