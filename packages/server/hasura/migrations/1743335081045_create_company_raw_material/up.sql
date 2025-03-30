-- Create company_raw_material table
CREATE TABLE "company_raw_material" (
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
  "qty" numeric ,
  "value" numeric ,
  "symbol" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_raw_material" add constraint "u_company_raw_material" unique ("co_code", "yrc", "month", "quarter", "year", "prname", "uom", "symbol");
CREATE INDEX "idx_company_raw_material_co_code" on "public"."company_raw_material" using btree ("co_code");
CREATE INDEX "idx_company_raw_material_yrc" on "public"."company_raw_material" using btree ("yrc");
CREATE INDEX "idx_company_raw_material_month" on "public"."company_raw_material" using btree ("month");
CREATE INDEX "idx_company_raw_material_quarter" on "public"."company_raw_material" using btree ("quarter");
CREATE INDEX "idx_company_raw_material_year" on "public"."company_raw_material" using btree ("year");
CREATE INDEX "idx_company_raw_material_prname" on "public"."company_raw_material" using btree ("prname");
CREATE INDEX "idx_company_raw_material_uom" on "public"."company_raw_material" using btree ("uom");
CREATE INDEX "idx_company_raw_material_symbol" on "public"."company_raw_material" using btree ("symbol");
