-- Create company_insider_trading table
CREATE TABLE "company_insider_trading" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "companyname" text ,
  "personname" text ,
  "category" text ,
  "typeofsecuritiesheldprior" text ,
  "numberofsecuritiesheldprior" integer ,
  "percentage_securitiesheldprior" numeric ,
  "valueofsecurities" integer ,
  "totalsecurities" integer ,
  "transactiontype" text ,
  "typeofsecuritiesheldpost" text ,
  "numberofsecuritiesheldpost" integer ,
  "percentage_securitiesheldpost" numeric ,
  "fromdateofacquisition" date ,
  "todateofacquisition" date ,
  "modeofacquisition" text ,
  "exchangereporteddate" date ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_insider_trading_co_code_index" on "public"."company_insider_trading" using btree ("co_code");
