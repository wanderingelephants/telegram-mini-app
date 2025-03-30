-- Create company_annual_report_data_declaration_list table
CREATE TABLE "company_annual_report_data_declaration_list" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "reportdate" date ,
  "reporttype" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_annual_report_data_declaration_list" add constraint "u_company_annual_report_data_declaration_list" unique ("co_code", "reportdate", "reporttype");
CREATE INDEX "idx_company_annual_report_data_declaration_list_co_code" on "public"."company_annual_report_data_declaration_list" using btree ("co_code");
CREATE INDEX "idx_company_annual_report_data_declaration_list_reportdate" on "public"."company_annual_report_data_declaration_list" using btree ("reportdate");
CREATE INDEX "idx_company_annual_report_data_declaration_list_reporttype" on "public"."company_annual_report_data_declaration_list" using btree ("reporttype");
