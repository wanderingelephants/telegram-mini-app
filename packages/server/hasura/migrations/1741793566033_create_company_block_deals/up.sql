-- Create company_block_deals table
CREATE TABLE "company_block_deals" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "record_date" date,
  "co_code" integer,
  "scripcode" text,
  "serial" integer,
  "scripname" text,
  "clientname" text,
  "buysell" text,
  "qtyshares" numeric,
  "avg_price" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_block_deals" add constraint "company_block_deals_co_code" unique ("co_code");
CREATE INDEX "idx_company_block_deals_co_code" on "public"."company_block_deals" using btree ("co_code");
CREATE INDEX "idx_company_block_deals_record_date" on "public"."company_block_deals" using btree ("record_date");
