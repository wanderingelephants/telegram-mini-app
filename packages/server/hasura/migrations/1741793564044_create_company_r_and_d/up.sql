-- Create company_r_and_d table
CREATE TABLE "company_r_and_d" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "yrc" text,
  "capital" numeric,
  "recurring" numeric,
  "percentage" numeric,
  "year" numeric,
  "flag" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_r_and_d" add constraint "company_r_and_d_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_r_and_d_co_code" on "public"."company_r_and_d" using btree ("co_code");
