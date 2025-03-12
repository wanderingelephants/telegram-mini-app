-- Create company_results_today table
CREATE TABLE "company_results_today" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "symbol" text ,
  "isin" text ,
  "co_name" text ,
  "announcementdate" date ,
  "resultdate" date ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_results_today_co_code_index" on "public"."company_results_today" using btree ("co_code");
