-- Create company_shp_aggregate table
CREATE TABLE "company_shp_aggregate" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "yrc" integer,
  "promoters" numeric,
  "retail" numeric,
  "foreigninstitution" numeric,
  "mutualfund" numeric,
  "otherdomesticinstitution" numeric,
  "others" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_shp_aggregate" add constraint "company_shp_aggregate_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_shp_aggregate_co_code" on "public"."company_shp_aggregate" using btree ("co_code");
