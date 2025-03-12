-- Create company_pledge_shares_details table
CREATE TABLE "company_pledge_shares_details" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "record_date" date ,
  "type" text ,
  "name" text ,
  "totalpledgeshares" numeric ,
  "perc_totalsharesheld" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
, UNIQUE(co_code, record_date));
CREATE INDEX "company_pledge_shares_details_co_code_index" on "public"."company_pledge_shares_details" using btree ("co_code");
CREATE INDEX "company_pledge_shares_details_record_date_index" on "public"."company_pledge_shares_details" using btree ("record_date");
