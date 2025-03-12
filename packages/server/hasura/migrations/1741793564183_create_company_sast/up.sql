-- Create company_sast table
CREATE TABLE "company_sast" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "securityname" text,
  "nameofacquirer_seller" text,
  "promoter_promotergroup" text,
  "transactionperiod" date,
  "acq_sale" text,
  "modeofbuy_sale" text,
  "transactedquantity" integer,
  "transactedquantity_perchange" numeric,
  "holdingaftertransactionquantity" integer,
  "holdingaftertransaction_perchange_totalcapital" numeric,
  "holdingaftertransaction_perchange_dilutedcapital" numeric,
  "exchangereporteddate" date
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_sast" add constraint "company_sast_co_code" unique ("co_code");
CREATE INDEX "idx_company_sast_co_code" on "public"."company_sast" using btree ("co_code");
CREATE INDEX "idx_company_sast_exchangereporteddate" on "public"."company_sast" using btree ("exchangereporteddate");
