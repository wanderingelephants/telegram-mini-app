-- Create company_location table
CREATE TABLE "company_location" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "type" text ,
  "add1" text ,
  "add2" text ,
  "add3" text ,
  "city" text ,
  "pin" text ,
  "tel1" text ,
  "fax1" text ,
  "st_name" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_location_co_code_index" on "public"."company_location" using btree ("co_code");
