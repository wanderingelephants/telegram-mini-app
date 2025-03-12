-- Create company_margin_ratio table
CREATE TABLE "company_margin_ratio" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "yrc" integer,
  "co_code" integer,
  "pbidtim" numeric,
  "ebitm" numeric,
  "pretaxmargin" numeric,
  "patm" numeric,
  "cpm" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_margin_ratio" add constraint "company_margin_ratio_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_margin_ratio_co_code" on "public"."company_margin_ratio" using btree ("co_code");
