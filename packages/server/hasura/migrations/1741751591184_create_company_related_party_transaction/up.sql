-- Create company_related_party_transaction table
CREATE TABLE "company_related_party_transaction" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "yrc" integer ,
  "slno" integer ,
  "nat_trans" text ,
  "assoc" numeric ,
  "subsi" numeric ,
  "kmp" numeric ,
  "rkmp" numeric ,
  "jv" numeric ,
  "ind" numeric ,
  "oth" numeric ,
  "hc" numeric ,
  "type" text ,
  "subtype" text ,
  "total" numeric ,
  "class" text ,
  "flag" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_related_party_transaction_co_code_index" on "public"."company_related_party_transaction" using btree ("co_code");
