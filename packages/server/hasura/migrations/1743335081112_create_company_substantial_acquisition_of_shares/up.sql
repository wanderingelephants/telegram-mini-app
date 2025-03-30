-- Create company_substantial_acquisition_of_shares table
CREATE TABLE "company_substantial_acquisition_of_shares" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "securityname" text ,
  "nameofacquirer_seller" text ,
  "promoter_promotergroup" text ,
  "transactionperiod" date ,
  "acq_sale" text ,
  "modeofbuy_sale" text ,
  "transactedquantity" numeric ,
  "transactedquantity_perchange" numeric ,
  "holdingaftertransactionquantity" numeric ,
  "holdingaftertransaction_perchange_totalcapital" numeric ,
  "holdingaftertransaction_perchange_dilutedcapital" numeric ,
  "exchangereporteddate" date 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_substantial_acquisition_of_shares" add constraint "u_company_substantial_acquisition_of_shares" unique ("co_code", "securityname", "nameofacquirer_seller", "promoter_promotergroup", "transactionperiod", "acq_sale", "modeofbuy_sale", "exchangereporteddate");
CREATE INDEX "idx_company_substantial_acquisition_of_shares_co_code" on "public"."company_substantial_acquisition_of_shares" using btree ("co_code");
CREATE INDEX "idx_company_substantial_acquisition_of_shares_securityname" on "public"."company_substantial_acquisition_of_shares" using btree ("securityname");
CREATE INDEX "idx_company_substantial_acquisition_of_shares_nameofacquirer_seller" on "public"."company_substantial_acquisition_of_shares" using btree ("nameofacquirer_seller");
CREATE INDEX "idx_company_substantial_acquisition_of_shares_promoter_promotergroup" on "public"."company_substantial_acquisition_of_shares" using btree ("promoter_promotergroup");
CREATE INDEX "idx_company_substantial_acquisition_of_shares_transactionperiod" on "public"."company_substantial_acquisition_of_shares" using btree ("transactionperiod");
CREATE INDEX "idx_company_substantial_acquisition_of_shares_acq_sale" on "public"."company_substantial_acquisition_of_shares" using btree ("acq_sale");
CREATE INDEX "idx_company_substantial_acquisition_of_shares_modeofbuy_sale" on "public"."company_substantial_acquisition_of_shares" using btree ("modeofbuy_sale");
CREATE INDEX "idx_company_substantial_acquisition_of_shares_exchangereporteddate" on "public"."company_substantial_acquisition_of_shares" using btree ("exchangereporteddate");
