-- Create company_sector_wise_company table
CREATE TABLE "company_sector_wise_company" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "co_name" text ,
  "lname" text ,
  "sect_code" integer ,
  "sc_code" integer ,
  "symbol" text ,
  "sect_name" text ,
  "exchange_bse" text ,
  "exchange_nse" text ,
  "isin" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
,FOREIGN KEY ("sect_code") REFERENCES "company_sector_master" (sect_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_sector_wise_company_co_code_index" on "public"."company_sector_wise_company" using btree ("co_code");
CREATE INDEX "company_sector_wise_company_sect_code_index" on "public"."company_sector_wise_company" using btree ("sect_code");
