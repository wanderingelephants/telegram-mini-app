-- Create company_employee_count table
CREATE TABLE "company_employee_count" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "yrc" integer ,
  "totalempoyee_male" numeric ,
  "totalempoyee_female" numeric ,
  "totalempoyee" numeric ,
  "totalemployee_contractbasis" numeric ,
  "permenantwomenemployee" numeric ,
  "permenantdisabledemployee" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_employee_count_co_code_index" on "public"."company_employee_count" using btree ("co_code");
