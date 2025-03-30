-- Create company_balance_sheet_quarterly table
CREATE TABLE "company_balance_sheet_quarterly" (
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
ALTER TABLE "public"."company_balance_sheet_quarterly" add constraint "u_company_balance_sheet_quarterly" unique ("co_code", "isconsolidated", "key_category", "key", "month", "quarter", "year", "rowno", "rid");
CREATE INDEX "idx_company_balance_sheet_quarterly_co_code" on "public"."company_balance_sheet_quarterly" using btree ("co_code");
CREATE INDEX "idx_company_balance_sheet_quarterly_isconsolidated" on "public"."company_balance_sheet_quarterly" using btree ("isconsolidated");
CREATE INDEX "idx_company_balance_sheet_quarterly_key_category" on "public"."company_balance_sheet_quarterly" using btree ("key_category");
CREATE INDEX "idx_company_balance_sheet_quarterly_key" on "public"."company_balance_sheet_quarterly" using btree ("key");
CREATE INDEX "idx_company_balance_sheet_quarterly_month" on "public"."company_balance_sheet_quarterly" using btree ("month");
CREATE INDEX "idx_company_balance_sheet_quarterly_quarter" on "public"."company_balance_sheet_quarterly" using btree ("quarter");
CREATE INDEX "idx_company_balance_sheet_quarterly_year" on "public"."company_balance_sheet_quarterly" using btree ("year");
CREATE INDEX "idx_company_balance_sheet_quarterly_rowno" on "public"."company_balance_sheet_quarterly" using btree ("rowno");
CREATE INDEX "idx_company_balance_sheet_quarterly_rid" on "public"."company_balance_sheet_quarterly" using btree ("rid");
