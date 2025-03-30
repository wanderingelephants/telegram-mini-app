-- Create company_block_deals table
CREATE TABLE "company_block_deals" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "record_date" date ,
  "clientname" text ,
  "buysell" boolean ,
  "avg_price" numeric ,
  "qtyshares" integer 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_block_deals" add constraint "u_company_block_deals" unique ("co_code", "record_date", "clientname");
CREATE INDEX "idx_company_block_deals_co_code" on "public"."company_block_deals" using btree ("co_code");
CREATE INDEX "idx_company_block_deals_record_date" on "public"."company_block_deals" using btree ("record_date");
CREATE INDEX "idx_company_block_deals_clientname" on "public"."company_block_deals" using btree ("clientname");
