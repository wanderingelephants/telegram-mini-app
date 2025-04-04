-- Create company_management_biodata table
CREATE TABLE "company_management_biodata" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "lname" text ,
  "memo" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_management_biodata" add constraint "u_company_management_biodata" unique ("co_code");
CREATE INDEX "idx_company_management_biodata_co_code" on "public"."company_management_biodata" using btree ("co_code");
