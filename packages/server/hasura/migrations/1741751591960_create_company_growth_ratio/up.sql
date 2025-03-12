-- Create company_growth_ratio table
CREATE TABLE "company_growth_ratio" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "yrc" integer ,
  "co_code" integer ,
  "netsalesgrowth" numeric ,
  "ebitdagrowth" numeric ,
  "ebitgrowth" numeric ,
  "patgrowth" numeric ,
  "eps" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_growth_ratio_co_code_index" on "public"."company_growth_ratio" using btree ("co_code");
