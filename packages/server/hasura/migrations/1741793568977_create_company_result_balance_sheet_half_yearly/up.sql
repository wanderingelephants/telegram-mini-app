-- Create company_result_balance_sheet_half_yearly table
CREATE TABLE "company_result_balance_sheet_half_yearly" (
  id SERIAL PRIMARY KEY,
  "sources_of_funds" numeric,
  "share_capital" numeric,
  "reserves_surplus" numeric,
  "equity_share_warrants" numeric,
  "equity_application_money" numeric,
  "esop_outstanding" numeric,
  "loan_funds" numeric,
  "secured_loan" numeric,
  "unsecured_loan" numeric,
  "foreign_currency_monetaryitem_translation_diff_l" numeric,
  "deferred_tax_liability" numeric,
  "other_liabilities" numeric,
  "total_liabilities" numeric,
  "application_of_funds" numeric,
  "fixed_assets" numeric,
  "intangible_assets" numeric,
  "loans" numeric,
  "investments" numeric,
  "foreign_currency_monetaryitem_translation_diff_a" numeric,
  "current_assets_loans_advances" numeric,
  "inventories" numeric,
  "sundry_debtors" numeric,
  "cash_bank_balance" numeric,
  "other_current_assets" numeric,
  "loans_advances" numeric,
  "current_liabilities_provisions" numeric,
  "current_liabilities" numeric,
  "provisions" numeric,
  "net_current_assets" numeric,
  "deferred_tax_assets" numeric,
  "miscellaneous_expenses_not_w_off" numeric,
  "profit_loss_a_c" numeric,
  "other_assets" numeric,
  "total_assets" numeric,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "month" integer,
  "quarter" integer,
  "year" integer
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_result_balance_sheet_half_yearly" add constraint "company_result_balance_sheet_half_yearly_co_code_mqy" unique ("co_code", "month", "quarter", "year");
CREATE INDEX "idx_company_result_balance_sheet_half_yearly_co_code" on "public"."company_result_balance_sheet_half_yearly" using btree ("co_code");
CREATE INDEX "idx_company_result_balance_sheet_half_yearly_month" on "public"."company_result_balance_sheet_half_yearly" using btree ("month");
CREATE INDEX "idx_company_result_balance_sheet_half_yearly_quarter" on "public"."company_result_balance_sheet_half_yearly" using btree ("quarter");
CREATE INDEX "idx_company_result_balance_sheet_half_yearly_year" on "public"."company_result_balance_sheet_half_yearly" using btree ("year");
