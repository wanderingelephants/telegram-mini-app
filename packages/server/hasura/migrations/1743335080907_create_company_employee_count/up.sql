-- Create company_employee_count table
CREATE TABLE "company_employee_count" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "yrc" integer ,
  "month" integer ,
  "quarter" integer ,
  "year" integer ,
  "totalempoyee_male" numeric ,
  "totalempoyee_female" numeric ,
  "totalempoyee" numeric ,
  "totalemployee_contractbasis" numeric ,
  "permenantwomenemployee" numeric ,
  "permenantdisabledemployee" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_employee_count" add constraint "u_company_employee_count" unique ("co_code", "yrc", "month", "quarter", "year");
CREATE INDEX "idx_company_employee_count_co_code" on "public"."company_employee_count" using btree ("co_code");
CREATE INDEX "idx_company_employee_count_yrc" on "public"."company_employee_count" using btree ("yrc");
CREATE INDEX "idx_company_employee_count_month" on "public"."company_employee_count" using btree ("month");
CREATE INDEX "idx_company_employee_count_quarter" on "public"."company_employee_count" using btree ("quarter");
CREATE INDEX "idx_company_employee_count_year" on "public"."company_employee_count" using btree ("year");
