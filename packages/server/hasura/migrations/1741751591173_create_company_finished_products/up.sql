-- Create company_finished_products table
CREATE TABLE "company_finished_products" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "lname" text ,
  "yrc" text ,
  "prname" text ,
  "uom" text ,
  "per_sale" numeric ,
  "inst" numeric ,
  "prodn" numeric ,
  "saleqty" numeric ,
  "saleval" numeric ,
  "symbol" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_finished_products_co_code_index" on "public"."company_finished_products" using btree ("co_code");
