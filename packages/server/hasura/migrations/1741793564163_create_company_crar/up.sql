-- Create company_crar table
CREATE TABLE "company_crar" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "yrc" integer,
  "grossnonperformingassets" numeric,
  "netnonperformingassets" numeric,
  "capitaladequacyratio_baseliii" numeric,
  "tiericapital" numeric,
  "tieriicapital" numeric
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_crar" add constraint "company_crar_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_crar_co_code" on "public"."company_crar" using btree ("co_code");
