-- Create company_sector_master table
CREATE TABLE "company_sector_master" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "sect_code" integer,
  "sect_name" text
);
ALTER TABLE "public"."company_sector_master" add constraint "company_sector_master_sect_code" unique ("sect_code");
