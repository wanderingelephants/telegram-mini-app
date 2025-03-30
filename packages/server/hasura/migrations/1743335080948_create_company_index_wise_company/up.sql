-- Create company_index_wise_company table
CREATE TABLE "company_index_wise_company" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "companyshortname" text ,
  "companylongname" text ,
  "index_code" integer  not null,
  "bsecode" integer ,
  "nsesymbol" text ,
  "isin" text ,
  "sectorname" text 
,  FOREIGN KEY ("index_code") REFERENCES "company_index_master" (index_code) ON UPDATE restrict ON DELETE restrict
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_index_wise_company" add constraint "u_company_index_wise_company" unique ("co_code", "index_code");
CREATE INDEX "idx_company_index_wise_company_co_code" on "public"."company_index_wise_company" using btree ("co_code");
CREATE INDEX "idx_company_index_wise_company_index_code" on "public"."company_index_wise_company" using btree ("index_code");
