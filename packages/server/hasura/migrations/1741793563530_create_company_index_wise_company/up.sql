-- Create company_index_wise_company table
CREATE TABLE "company_index_wise_company" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "companyshortname" text,
  "companylongname" text,
  "index_code" integer,
  "bsecode" integer,
  "nsesymbol" text,
  "isin" text,
  "sectorname" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
,  FOREIGN KEY ("index_code") REFERENCES "company_index_master" (index_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_index_wise_company" add constraint "company_index_wise_company_index_code_co_code" unique ("index_code", "co_code");
CREATE INDEX "idx_company_index_wise_company_co_code" on "public"."company_index_wise_company" using btree ("co_code");
CREATE INDEX "idx_company_index_wise_company_index_code" on "public"."company_index_wise_company" using btree ("index_code");
