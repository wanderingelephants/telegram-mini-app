-- Create company_index_master table
CREATE TABLE "company_index_master" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "exchange" text,
  "index_code" integer,
  "index_name" text,
  "index_symbol" text
);
ALTER TABLE "public"."company_index_master" add constraint "company_index_master_index_code" unique ("index_code");
