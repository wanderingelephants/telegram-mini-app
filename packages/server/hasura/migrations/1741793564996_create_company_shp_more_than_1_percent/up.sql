-- Create company_shp_more_than_1_percent table
CREATE TABLE "company_shp_more_than_1_percent" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "holding_date" date,
  "type" text,
  "name" text,
  "noofshares" text,
  "perstake" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_shp_more_than_1_percent" add constraint "company_shp_more_than_1_percent_co_code" unique ("co_code");
CREATE INDEX "idx_company_shp_more_than_1_percent_co_code" on "public"."company_shp_more_than_1_percent" using btree ("co_code");
CREATE INDEX "idx_company_shp_more_than_1_percent_holding_date" on "public"."company_shp_more_than_1_percent" using btree ("holding_date");
