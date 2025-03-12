-- Create company_sector_master table
CREATE TABLE "company_sector_master" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "sect_code" integer unique,
  "sect_name" text 
);
