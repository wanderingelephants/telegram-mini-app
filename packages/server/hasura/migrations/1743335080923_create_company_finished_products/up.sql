-- Create company_finished_products table
CREATE TABLE "company_finished_products" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "lname" text ,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "prname" text ,
  "uom" text ,
  "per_sale" numeric ,
  "inst" numeric ,
  "prodn" numeric ,
  "saleqty" numeric ,
  "saleval" numeric ,
  "symbol" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_finished_products" add constraint "u_company_finished_products" unique ("co_code", "lname", "yrc", "month", "quarter", "year", "prname", "uom");
CREATE INDEX "idx_company_finished_products_co_code" on "public"."company_finished_products" using btree ("co_code");
CREATE INDEX "idx_company_finished_products_lname" on "public"."company_finished_products" using btree ("lname");
CREATE INDEX "idx_company_finished_products_yrc" on "public"."company_finished_products" using btree ("yrc");
CREATE INDEX "idx_company_finished_products_month" on "public"."company_finished_products" using btree ("month");
CREATE INDEX "idx_company_finished_products_quarter" on "public"."company_finished_products" using btree ("quarter");
CREATE INDEX "idx_company_finished_products_year" on "public"."company_finished_products" using btree ("year");
CREATE INDEX "idx_company_finished_products_prname" on "public"."company_finished_products" using btree ("prname");
CREATE INDEX "idx_company_finished_products_uom" on "public"."company_finished_products" using btree ("uom");
