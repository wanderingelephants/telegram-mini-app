-- Create company_capital_structure table
CREATE TABLE "company_capital_structure" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "equityauthorised" integer ,
  "equityissued" numeric ,
  "equitysubs" numeric ,
  "facevalue" integer ,
  "equitysharespaidup" numeric ,
  "equitypaidup" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_capital_structure" add constraint "u_company_capital_structure" unique ("co_code", "yrc", "month", "quarter", "year");
CREATE INDEX "idx_company_capital_structure_co_code" on "public"."company_capital_structure" using btree ("co_code");
CREATE INDEX "idx_company_capital_structure_yrc" on "public"."company_capital_structure" using btree ("yrc");
CREATE INDEX "idx_company_capital_structure_month" on "public"."company_capital_structure" using btree ("month");
CREATE INDEX "idx_company_capital_structure_quarter" on "public"."company_capital_structure" using btree ("quarter");
CREATE INDEX "idx_company_capital_structure_year" on "public"."company_capital_structure" using btree ("year");
