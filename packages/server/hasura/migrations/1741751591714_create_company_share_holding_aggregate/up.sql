-- Create company_share_holding_aggregate table
CREATE TABLE "company_share_holding_aggregate" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "yrc" integer ,
  "promoters" numeric ,
  "retail" numeric ,
  "foreigninstitution" numeric ,
  "mutualfund" numeric ,
  "otherdomesticinstitution" numeric ,
  "others" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_share_holding_aggregate_co_code_index" on "public"."company_share_holding_aggregate" using btree ("co_code");
