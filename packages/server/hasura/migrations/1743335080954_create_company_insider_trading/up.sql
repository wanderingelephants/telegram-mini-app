-- Create company_insider_trading table
CREATE TABLE "company_insider_trading" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "companyname" text ,
  "personname" text ,
  "category" text ,
  "typeofsecuritiesheldprior" text ,
  "numberofsecuritiesheldprior" numeric ,
  "percentage_securitiesheldprior" numeric ,
  "valueofsecurities" numeric ,
  "totalsecurities" numeric ,
  "transactiontype" text ,
  "typeofsecuritiesheldpost" text ,
  "numberofsecuritiesheldpost" numeric ,
  "percentage_securitiesheldpost" numeric ,
  "fromdateofacquisition" date ,
  "todateofacquisition" date ,
  "modeofacquisition" text ,
  "exchangereporteddate" date 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_insider_trading" add constraint "u_company_insider_trading" unique ("co_code", "personname", "category", "typeofsecuritiesheldprior", "numberofsecuritiesheldprior", "percentage_securitiesheldprior", "valueofsecurities", "totalsecurities", "transactiontype", "typeofsecuritiesheldpost", "numberofsecuritiesheldpost", "percentage_securitiesheldpost", "fromdateofacquisition", "todateofacquisition", "modeofacquisition", "exchangereporteddate");
CREATE INDEX "idx_company_insider_trading_co_code" on "public"."company_insider_trading" using btree ("co_code");
CREATE INDEX "idx_company_insider_trading_personname" on "public"."company_insider_trading" using btree ("personname");
CREATE INDEX "idx_company_insider_trading_category" on "public"."company_insider_trading" using btree ("category");
CREATE INDEX "idx_company_insider_trading_typeofsecuritiesheldprior" on "public"."company_insider_trading" using btree ("typeofsecuritiesheldprior");
CREATE INDEX "idx_company_insider_trading_transactiontype" on "public"."company_insider_trading" using btree ("transactiontype");
CREATE INDEX "idx_company_insider_trading_fromdateofacquisition" on "public"."company_insider_trading" using btree ("fromdateofacquisition");
CREATE INDEX "idx_company_insider_trading_todateofacquisition" on "public"."company_insider_trading" using btree ("todateofacquisition");
CREATE INDEX "idx_company_insider_trading_modeofacquisition" on "public"."company_insider_trading" using btree ("modeofacquisition");
CREATE INDEX "idx_company_insider_trading_exchangereporteddate" on "public"."company_insider_trading" using btree ("exchangereporteddate");
