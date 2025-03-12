-- Create company_master table
CREATE TABLE "company_master" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "bsecode" integer,
  "nsesymbol" text,
  "companyname" text,
  "companyshortname" text,
  "categoryname" text,
  "isin" text,
  "bsegroup" text,
  "mcaptype" text,
  "sectorcode" integer,
  "sectorname" text,
  "industrycode" integer,
  "industryname" text,
  "bselistedflag" text,
  "nselistedflag" text,
  "displaytype" text,
  "bsestatus" text,
  "nsestatus" text,
  "mcap" numeric
);
ALTER TABLE "public"."company_master" add constraint "company_master_co_code" unique ("co_code");
