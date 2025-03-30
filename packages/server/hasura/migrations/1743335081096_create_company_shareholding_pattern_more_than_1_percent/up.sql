-- Create company_shareholding_pattern_more_than_1_percent table
CREATE TABLE "company_shareholding_pattern_more_than_1_percent" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "record_date" date ,
  "type" text ,
  "name" text ,
  "noofshares" numeric ,
  "perstake" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_shareholding_pattern_more_than_1_percent" add constraint "u_company_shareholding_pattern_more_than_1_percent" unique ("co_code", "record_date", "type", "name");
CREATE INDEX "idx_company_shareholding_pattern_more_than_1_percent_co_code" on "public"."company_shareholding_pattern_more_than_1_percent" using btree ("co_code");
CREATE INDEX "idx_company_shareholding_pattern_more_than_1_percent_record_date" on "public"."company_shareholding_pattern_more_than_1_percent" using btree ("record_date");
CREATE INDEX "idx_company_shareholding_pattern_more_than_1_percent_type" on "public"."company_shareholding_pattern_more_than_1_percent" using btree ("type");
CREATE INDEX "idx_company_shareholding_pattern_more_than_1_percent_name" on "public"."company_shareholding_pattern_more_than_1_percent" using btree ("name");
