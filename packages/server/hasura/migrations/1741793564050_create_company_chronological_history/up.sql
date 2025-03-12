-- Create company_chronological_history table
CREATE TABLE "company_chronological_history" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "co_code" integer,
  "lname" text,
  "yrc" text,
  "eqtyason" text,
  "eqty" numeric,
  "remarks" text
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_chronological_history" add constraint "company_chronological_history_yrc_co_code" unique ("yrc", "co_code");
CREATE INDEX "idx_company_chronological_history_co_code" on "public"."company_chronological_history" using btree ("co_code");
