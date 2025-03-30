-- Create company_r_and_d table
CREATE TABLE "company_r_and_d" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "capital" numeric ,
  "recurring" numeric ,
  "percentage" numeric ,
  "flag" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_r_and_d" add constraint "u_company_r_and_d" unique ("co_code", "yrc", "month", "quarter", "year", "flag");
CREATE INDEX "idx_company_r_and_d_co_code" on "public"."company_r_and_d" using btree ("co_code");
CREATE INDEX "idx_company_r_and_d_yrc" on "public"."company_r_and_d" using btree ("yrc");
CREATE INDEX "idx_company_r_and_d_month" on "public"."company_r_and_d" using btree ("month");
CREATE INDEX "idx_company_r_and_d_quarter" on "public"."company_r_and_d" using btree ("quarter");
CREATE INDEX "idx_company_r_and_d_year" on "public"."company_r_and_d" using btree ("year");
CREATE INDEX "idx_company_r_and_d_flag" on "public"."company_r_and_d" using btree ("flag");
