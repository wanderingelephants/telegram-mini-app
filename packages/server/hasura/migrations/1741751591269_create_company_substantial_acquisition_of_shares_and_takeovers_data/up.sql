-- Create company_substantial_acquisition_of_shares_and_takeovers_data table
CREATE TABLE "company_substantial_acquisition_of_shares_and_takeovers_data" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "securityname" text ,
  "nameofacquirer_seller" text ,
  "promoter_promotergroup" text ,
  "transactionperiod" date ,
  "acq_sale" text ,
  "modeofbuy_sale" text ,
  "transactedquantity" integer ,
  "transactedquantity_perchange" numeric ,
  "holdingaftertransactionquantity" integer ,
  "holdingaftertransaction_perchange_totalcapital" numeric ,
  "holdingaftertransaction_perchange_dilutedcapital" numeric ,
  "exchangereporteddate" date ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_substantial_acquisition_of_shares_and_takeovers_data_co_code_index" on "public"."company_substantial_acquisition_of_shares_and_takeovers_data" using btree ("co_code");
