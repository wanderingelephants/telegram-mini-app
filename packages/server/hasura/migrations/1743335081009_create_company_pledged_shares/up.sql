-- Create company_pledged_shares table
CREATE TABLE "company_pledged_shares" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "record_date" date ,
  "type" text ,
  "name" text ,
  "totalpledgeshares" numeric ,
  "perc_totalsharesheld" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_pledged_shares" add constraint "u_company_pledged_shares" unique ("co_code", "record_date", "type", "name");
CREATE INDEX "idx_company_pledged_shares_co_code" on "public"."company_pledged_shares" using btree ("co_code");
CREATE INDEX "idx_company_pledged_shares_record_date" on "public"."company_pledged_shares" using btree ("record_date");
CREATE INDEX "idx_company_pledged_shares_type" on "public"."company_pledged_shares" using btree ("type");
CREATE INDEX "idx_company_pledged_shares_name" on "public"."company_pledged_shares" using btree ("name");
