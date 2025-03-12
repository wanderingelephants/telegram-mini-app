-- Create company_index_wise_company table
CREATE TABLE "company_index_wise_company" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "cmotscode" integer ,
  "companyshortname" text ,
  "companylongname" text ,
  "index_code" integer ,
  "bsecode" integer ,
  "nsesymbol" text ,
  "isin" text ,
  "sectorname" text ,
  FOREIGN KEY ("cmotscode") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
,FOREIGN KEY ("index_code") REFERENCES "company_index_master" (index_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_index_wise_company_cmotscode_index" on "public"."company_index_wise_company" using btree ("cmotscode");
CREATE INDEX "company_index_wise_company_index_code_index" on "public"."company_index_wise_company" using btree ("index_code");
