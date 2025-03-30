-- Create company_history table
CREATE TABLE "company_history" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "lname" text ,
  "memo" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_history" add constraint "u_company_history" unique ("co_code");
CREATE INDEX "idx_company_history_co_code" on "public"."company_history" using btree ("co_code");
