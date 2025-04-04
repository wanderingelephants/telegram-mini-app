-- Create company_results_today table
CREATE TABLE "company_results_today" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "symbol" text ,
  "isin" text ,
  "co_name" text ,
  "announcementdate" date ,
  "resultdate" date 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_results_today" add constraint "u_company_results_today" unique ("co_code", "resultdate");
CREATE INDEX "idx_company_results_today_co_code" on "public"."company_results_today" using btree ("co_code");
CREATE INDEX "idx_company_results_today_resultdate" on "public"."company_results_today" using btree ("resultdate");
