-- Create company_profit_and_loss table
CREATE TABLE "company_profit_and_loss" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "isconsolidated" boolean ,
  "key_category" text ,
  "key" text ,
  "value" numeric ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "rowno" integer ,
  "rid" integer 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_profit_and_loss" add constraint "u_company_profit_and_loss" unique ("co_code", "isconsolidated", "key_category", "key", "month", "quarter", "year", "rowno", "rid");
CREATE INDEX "idx_company_profit_and_loss_co_code" on "public"."company_profit_and_loss" using btree ("co_code");
CREATE INDEX "idx_company_profit_and_loss_isconsolidated" on "public"."company_profit_and_loss" using btree ("isconsolidated");
CREATE INDEX "idx_company_profit_and_loss_key_category" on "public"."company_profit_and_loss" using btree ("key_category");
CREATE INDEX "idx_company_profit_and_loss_key" on "public"."company_profit_and_loss" using btree ("key");
CREATE INDEX "idx_company_profit_and_loss_month" on "public"."company_profit_and_loss" using btree ("month");
CREATE INDEX "idx_company_profit_and_loss_quarter" on "public"."company_profit_and_loss" using btree ("quarter");
CREATE INDEX "idx_company_profit_and_loss_year" on "public"."company_profit_and_loss" using btree ("year");
CREATE INDEX "idx_company_profit_and_loss_rowno" on "public"."company_profit_and_loss" using btree ("rowno");
CREATE INDEX "idx_company_profit_and_loss_rid" on "public"."company_profit_and_loss" using btree ("rid");
