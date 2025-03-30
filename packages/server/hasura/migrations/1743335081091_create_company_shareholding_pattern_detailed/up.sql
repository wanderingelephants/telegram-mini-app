-- Create company_shareholding_pattern_detailed table
CREATE TABLE "company_shareholding_pattern_detailed" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "slno" integer ,
  "type" text ,
  "name" text ,
  "percentagestakeholding" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_shareholding_pattern_detailed" add constraint "u_company_shareholding_pattern_detailed" unique ("co_code", "yrc", "month", "quarter", "year", "slno", "type", "name");
CREATE INDEX "idx_company_shareholding_pattern_detailed_co_code" on "public"."company_shareholding_pattern_detailed" using btree ("co_code");
CREATE INDEX "idx_company_shareholding_pattern_detailed_yrc" on "public"."company_shareholding_pattern_detailed" using btree ("yrc");
CREATE INDEX "idx_company_shareholding_pattern_detailed_month" on "public"."company_shareholding_pattern_detailed" using btree ("month");
CREATE INDEX "idx_company_shareholding_pattern_detailed_quarter" on "public"."company_shareholding_pattern_detailed" using btree ("quarter");
CREATE INDEX "idx_company_shareholding_pattern_detailed_year" on "public"."company_shareholding_pattern_detailed" using btree ("year");
CREATE INDEX "idx_company_shareholding_pattern_detailed_slno" on "public"."company_shareholding_pattern_detailed" using btree ("slno");
CREATE INDEX "idx_company_shareholding_pattern_detailed_type" on "public"."company_shareholding_pattern_detailed" using btree ("type");
CREATE INDEX "idx_company_shareholding_pattern_detailed_name" on "public"."company_shareholding_pattern_detailed" using btree ("name");
