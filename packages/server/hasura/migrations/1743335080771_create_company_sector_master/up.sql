-- Create company_sector_master table
CREATE TABLE "company_sector_master" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "sect_code" integer  not null,
  "sect_name" text 
);
ALTER TABLE "public"."company_sector_master" add constraint "u_company_sector_master" unique ("sect_code");
CREATE INDEX "idx_company_sector_master_sect_code" on "public"."company_sector_master" using btree ("sect_code");
