-- Create company_balance_sheet_half_yearly table
CREATE TABLE "company_balance_sheet_half_yearly" (
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
ALTER TABLE "public"."company_balance_sheet_half_yearly" add constraint "u_company_balance_sheet_half_yearly" unique ("co_code", "isconsolidated", "key_category", "key", "month", "quarter", "year", "rowno", "rid");
CREATE INDEX "idx_company_balance_sheet_half_yearly_co_code" on "public"."company_balance_sheet_half_yearly" using btree ("co_code");
CREATE INDEX "idx_company_balance_sheet_half_yearly_isconsolidated" on "public"."company_balance_sheet_half_yearly" using btree ("isconsolidated");
CREATE INDEX "idx_company_balance_sheet_half_yearly_key_category" on "public"."company_balance_sheet_half_yearly" using btree ("key_category");
CREATE INDEX "idx_company_balance_sheet_half_yearly_key" on "public"."company_balance_sheet_half_yearly" using btree ("key");
CREATE INDEX "idx_company_balance_sheet_half_yearly_month" on "public"."company_balance_sheet_half_yearly" using btree ("month");
CREATE INDEX "idx_company_balance_sheet_half_yearly_quarter" on "public"."company_balance_sheet_half_yearly" using btree ("quarter");
CREATE INDEX "idx_company_balance_sheet_half_yearly_year" on "public"."company_balance_sheet_half_yearly" using btree ("year");
CREATE INDEX "idx_company_balance_sheet_half_yearly_rowno" on "public"."company_balance_sheet_half_yearly" using btree ("rowno");
CREATE INDEX "idx_company_balance_sheet_half_yearly_rid" on "public"."company_balance_sheet_half_yearly" using btree ("rid");
