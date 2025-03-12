-- Create company_capital_structure table
CREATE TABLE "company_capital_structure" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "yrc" integer ,
  "equityauthorised" integer ,
  "equityissued" numeric ,
  "equitysubs" numeric ,
  "facevalue" integer ,
  "equitysharespaidup" integer ,
  "equitypaidup" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_capital_structure_co_code_index" on "public"."company_capital_structure" using btree ("co_code");
