-- Create company_bulk_deals table
CREATE TABLE "company_bulk_deals" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "record_date" date ,
  "co_code" integer ,
  "scripcode" text ,
  "serial" integer ,
  "scripname" text ,
  "clientname" text ,
  "buysell" text ,
  "qtyshares" numeric ,
  "avg_price" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
, UNIQUE(co_code, record_date));
CREATE INDEX "company_bulk_deals_co_code_index" on "public"."company_bulk_deals" using btree ("co_code");
CREATE INDEX "company_bulk_deals_record_date_index" on "public"."company_bulk_deals" using btree ("record_date");
