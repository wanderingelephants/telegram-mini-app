-- Create company_share_holding_pattern_more_than_1_percent table
CREATE TABLE "company_share_holding_pattern_more_than_1_percent" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "holding_date" date ,
  "type" text ,
  "name" text ,
  "noofshares" text ,
  "perstake" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_share_holding_pattern_more_than_1_percent_co_code_index" on "public"."company_share_holding_pattern_more_than_1_percent" using btree ("co_code");
