-- Create company_shareholding_pattern_aggregate table
CREATE TABLE "company_shareholding_pattern_aggregate" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "promoters" numeric ,
  "retail" numeric ,
  "foreigninstitution" numeric ,
  "mutualfund" numeric ,
  "otherdomesticinstitution" numeric ,
  "others" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_shareholding_pattern_aggregate" add constraint "u_company_shareholding_pattern_aggregate" unique ("co_code", "yrc", "month", "quarter", "year");
CREATE INDEX "idx_company_shareholding_pattern_aggregate_co_code" on "public"."company_shareholding_pattern_aggregate" using btree ("co_code");
CREATE INDEX "idx_company_shareholding_pattern_aggregate_yrc" on "public"."company_shareholding_pattern_aggregate" using btree ("yrc");
CREATE INDEX "idx_company_shareholding_pattern_aggregate_month" on "public"."company_shareholding_pattern_aggregate" using btree ("month");
CREATE INDEX "idx_company_shareholding_pattern_aggregate_quarter" on "public"."company_shareholding_pattern_aggregate" using btree ("quarter");
CREATE INDEX "idx_company_shareholding_pattern_aggregate_year" on "public"."company_shareholding_pattern_aggregate" using btree ("year");
