-- Create company_raw_material table
CREATE TABLE "company_raw_material" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "lname" text,
  "yrc" text,
  "prname" text,
  "uom" text,
  "qty" numeric,
  "value" numeric,
  "year" text,
  "symbol" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_raw_material" add constraint "company_raw_material_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_raw_material_co_code" on "public"."company_raw_material" using btree ("co_code");
