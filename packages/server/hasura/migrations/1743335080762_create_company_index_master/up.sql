-- Create company_index_master table
CREATE TABLE "company_index_master" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "exchange" text ,
  "index_code" integer  not null,
  "index_name" text ,
  "index_symbol" text 
);
ALTER TABLE "public"."company_index_master" add constraint "u_company_index_master" unique ("index_code");
CREATE INDEX "idx_company_index_master_index_code" on "public"."company_index_master" using btree ("index_code");
