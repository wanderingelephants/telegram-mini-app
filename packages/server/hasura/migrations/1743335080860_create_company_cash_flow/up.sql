-- Create company_cash_flow table
CREATE TABLE "company_cash_flow" (
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
ALTER TABLE "public"."company_cash_flow" add constraint "u_company_cash_flow" unique ("co_code", "isconsolidated", "key_category", "key", "month", "quarter", "year", "rowno", "rid");
CREATE INDEX "idx_company_cash_flow_co_code" on "public"."company_cash_flow" using btree ("co_code");
CREATE INDEX "idx_company_cash_flow_isconsolidated" on "public"."company_cash_flow" using btree ("isconsolidated");
CREATE INDEX "idx_company_cash_flow_key_category" on "public"."company_cash_flow" using btree ("key_category");
CREATE INDEX "idx_company_cash_flow_key" on "public"."company_cash_flow" using btree ("key");
CREATE INDEX "idx_company_cash_flow_month" on "public"."company_cash_flow" using btree ("month");
CREATE INDEX "idx_company_cash_flow_quarter" on "public"."company_cash_flow" using btree ("quarter");
CREATE INDEX "idx_company_cash_flow_year" on "public"."company_cash_flow" using btree ("year");
CREATE INDEX "idx_company_cash_flow_rowno" on "public"."company_cash_flow" using btree ("rowno");
CREATE INDEX "idx_company_cash_flow_rid" on "public"."company_cash_flow" using btree ("rid");
