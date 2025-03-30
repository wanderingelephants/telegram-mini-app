-- Create company_related_party_transaction table
CREATE TABLE "company_related_party_transaction" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
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
  "flag" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_related_party_transaction" add constraint "u_company_related_party_transaction" unique ("co_code", "yrc", "month", "quarter", "year", "slno", "nat_trans", "type", "subtype", "class", "flag");
CREATE INDEX "idx_company_related_party_transaction_co_code" on "public"."company_related_party_transaction" using btree ("co_code");
CREATE INDEX "idx_company_related_party_transaction_yrc" on "public"."company_related_party_transaction" using btree ("yrc");
CREATE INDEX "idx_company_related_party_transaction_month" on "public"."company_related_party_transaction" using btree ("month");
CREATE INDEX "idx_company_related_party_transaction_quarter" on "public"."company_related_party_transaction" using btree ("quarter");
CREATE INDEX "idx_company_related_party_transaction_year" on "public"."company_related_party_transaction" using btree ("year");
CREATE INDEX "idx_company_related_party_transaction_slno" on "public"."company_related_party_transaction" using btree ("slno");
CREATE INDEX "idx_company_related_party_transaction_nat_trans" on "public"."company_related_party_transaction" using btree ("nat_trans");
CREATE INDEX "idx_company_related_party_transaction_type" on "public"."company_related_party_transaction" using btree ("type");
CREATE INDEX "idx_company_related_party_transaction_subtype" on "public"."company_related_party_transaction" using btree ("subtype");
CREATE INDEX "idx_company_related_party_transaction_class" on "public"."company_related_party_transaction" using btree ("class");
CREATE INDEX "idx_company_related_party_transaction_flag" on "public"."company_related_party_transaction" using btree ("flag");
