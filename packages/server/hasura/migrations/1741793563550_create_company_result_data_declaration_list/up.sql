-- Create company_result_data_declaration_list table
CREATE TABLE "company_result_data_declaration_list" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "resultdate" date,
  "reporttype" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_result_data_declaration_list" add constraint "company_result_data_declaration_list_reporttype_resultdate_co_" unique ("reporttype", "resultdate", "co_code");
CREATE INDEX "idx_company_result_data_declaration_list_co_code" on "public"."company_result_data_declaration_list" using btree ("co_code");
CREATE INDEX "idx_company_result_data_declaration_list_resultdate" on "public"."company_result_data_declaration_list" using btree ("resultdate");
CREATE INDEX "idx_company_result_data_declaration_list_reporttype" on "public"."company_result_data_declaration_list" using btree ("reporttype");
