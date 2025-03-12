-- Create company_result_data_declaration_list table
CREATE TABLE "company_result_data_declaration_list" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "resultdate" date ,
  "reporttype" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_result_data_declaration_list_co_code_index" on "public"."company_result_data_declaration_list" using btree ("co_code");
