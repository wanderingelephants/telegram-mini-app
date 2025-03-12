-- Create company_capital_structure table
CREATE TABLE "company_capital_structure" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "yrc" integer,
  "equityauthorised" integer,
  "equityissued" numeric,
  "equitysubs" numeric,
  "facevalue" integer,
  "equitysharespaidup" integer,
  "equitypaidup" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_capital_structure" add constraint "company_capital_structure_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_capital_structure_co_code" on "public"."company_capital_structure" using btree ("co_code");
