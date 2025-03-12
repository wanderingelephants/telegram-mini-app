-- Create company_share_holding_pattern_detailed table
CREATE TABLE "company_share_holding_pattern_detailed" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "yrc" integer ,
  "slno" integer ,
  "type" text ,
  "name" text ,
  "percentagestakeholding" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_share_holding_pattern_detailed_co_code_index" on "public"."company_share_holding_pattern_detailed" using btree ("co_code");
