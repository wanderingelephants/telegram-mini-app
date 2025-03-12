-- Create company_chronological_history table
CREATE TABLE "company_chronological_history" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "lname" text ,
  "yrc" text ,
  "eqtyason" text ,
  "eqty" numeric ,
  "remarks" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_chronological_history_co_code_index" on "public"."company_chronological_history" using btree ("co_code");
