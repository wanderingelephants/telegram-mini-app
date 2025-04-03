-- Create company_historical_price_volume_by_date table
CREATE TABLE "company_historical_price_volume_by_date" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "record_date" date ,
  "open" numeric ,
  "high" numeric ,
  "low" numeric ,
  "close" numeric ,
  "volume" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_historical_price_volume_by_date" add constraint "u_company_historical_price_volume_by_date" unique ("co_code", "record_date");
CREATE INDEX "idx_company_historical_price_volume_by_date_co_code" on "public"."company_historical_price_volume_by_date" using btree ("co_code");
CREATE INDEX "idx_company_historical_price_volume_by_date_record_date" on "public"."company_historical_price_volume_by_date" using btree ("record_date");
