-- Create company_finished_products table
CREATE TABLE "company_finished_products" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "lname" text,
  "yrc" text,
  "prname" text,
  "uom" text,
  "per_sale" numeric,
  "inst" numeric,
  "prodn" numeric,
  "saleqty" numeric,
  "saleval" numeric,
  "symbol" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_finished_products" add constraint "company_finished_products_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_finished_products_co_code" on "public"."company_finished_products" using btree ("co_code");
