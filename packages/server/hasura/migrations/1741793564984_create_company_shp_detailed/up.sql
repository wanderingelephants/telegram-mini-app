-- Create company_shp_detailed table
CREATE TABLE "company_shp_detailed" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "yrc" integer,
  "slno" integer,
  "type" text,
  "name" text,
  "percentagestakeholding" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_shp_detailed" add constraint "company_shp_detailed_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_shp_detailed_co_code" on "public"."company_shp_detailed" using btree ("co_code");
