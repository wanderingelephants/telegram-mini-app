-- Create company_capital_adequacy_ratio table
CREATE TABLE "company_capital_adequacy_ratio" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "grossnonperformingassets" numeric ,
  "netnonperformingassets" numeric ,
  "capitaladequacyratio_baseliii" numeric ,
  "tiericapital" numeric ,
  "tieriicapital" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_capital_adequacy_ratio" add constraint "u_company_capital_adequacy_ratio" unique ("co_code", "yrc", "month", "quarter", "year");
CREATE INDEX "idx_company_capital_adequacy_ratio_co_code" on "public"."company_capital_adequacy_ratio" using btree ("co_code");
CREATE INDEX "idx_company_capital_adequacy_ratio_yrc" on "public"."company_capital_adequacy_ratio" using btree ("yrc");
CREATE INDEX "idx_company_capital_adequacy_ratio_month" on "public"."company_capital_adequacy_ratio" using btree ("month");
CREATE INDEX "idx_company_capital_adequacy_ratio_quarter" on "public"."company_capital_adequacy_ratio" using btree ("quarter");
CREATE INDEX "idx_company_capital_adequacy_ratio_year" on "public"."company_capital_adequacy_ratio" using btree ("year");
