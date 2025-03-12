-- Create company_directors_report table
CREATE TABLE "company_directors_report" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "lname" text ,
  "directorrep" text ,
  "yr" integer ,
  "symbol" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_directors_report_co_code_index" on "public"."company_directors_report" using btree ("co_code");
