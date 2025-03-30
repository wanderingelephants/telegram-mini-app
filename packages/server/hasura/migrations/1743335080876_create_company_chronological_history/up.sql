-- Create company_chronological_history table
CREATE TABLE "company_chronological_history" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "lname" text ,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "eqtyason" text ,
  "eqty" numeric ,
  "remarks" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_chronological_history" add constraint "u_company_chronological_history" unique ("co_code", "yrc", "month", "quarter", "year", "eqtyason");
CREATE INDEX "idx_company_chronological_history_co_code" on "public"."company_chronological_history" using btree ("co_code");
CREATE INDEX "idx_company_chronological_history_yrc" on "public"."company_chronological_history" using btree ("yrc");
CREATE INDEX "idx_company_chronological_history_month" on "public"."company_chronological_history" using btree ("month");
CREATE INDEX "idx_company_chronological_history_quarter" on "public"."company_chronological_history" using btree ("quarter");
CREATE INDEX "idx_company_chronological_history_year" on "public"."company_chronological_history" using btree ("year");
CREATE INDEX "idx_company_chronological_history_eqtyason" on "public"."company_chronological_history" using btree ("eqtyason");
