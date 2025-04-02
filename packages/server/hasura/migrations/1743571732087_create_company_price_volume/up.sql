-- Create company_price_volume table
CREATE TABLE "company_price_volume" (
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
ALTER TABLE "public"."company_price_volume" add constraint "u_company_price_volume" unique ("co_code", "record_date");
CREATE INDEX "idx_company_price_volume_co_code" on "public"."company_price_volume" using btree ("co_code");
CREATE INDEX "idx_company_price_volume_record_date" on "public"."company_price_volume" using btree ("record_date");
