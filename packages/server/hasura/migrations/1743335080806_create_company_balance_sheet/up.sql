-- Create company_balance_sheet table
CREATE TABLE "company_balance_sheet" (
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
ALTER TABLE "public"."company_balance_sheet" add constraint "u_company_balance_sheet" unique ("co_code", "isconsolidated", "key_category", "key", "month", "quarter", "year", "rowno", "rid");
CREATE INDEX "idx_company_balance_sheet_co_code" on "public"."company_balance_sheet" using btree ("co_code");
CREATE INDEX "idx_company_balance_sheet_isconsolidated" on "public"."company_balance_sheet" using btree ("isconsolidated");
CREATE INDEX "idx_company_balance_sheet_key_category" on "public"."company_balance_sheet" using btree ("key_category");
CREATE INDEX "idx_company_balance_sheet_key" on "public"."company_balance_sheet" using btree ("key");
CREATE INDEX "idx_company_balance_sheet_month" on "public"."company_balance_sheet" using btree ("month");
CREATE INDEX "idx_company_balance_sheet_quarter" on "public"."company_balance_sheet" using btree ("quarter");
CREATE INDEX "idx_company_balance_sheet_year" on "public"."company_balance_sheet" using btree ("year");
CREATE INDEX "idx_company_balance_sheet_rowno" on "public"."company_balance_sheet" using btree ("rowno");
CREATE INDEX "idx_company_balance_sheet_rid" on "public"."company_balance_sheet" using btree ("rid");
