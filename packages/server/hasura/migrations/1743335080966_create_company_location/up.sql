-- Create company_location table
CREATE TABLE "company_location" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "type" text ,
  "add1" text ,
  "add2" text ,
  "add3" text ,
  "city" text ,
  "pin" text ,
  "tel1" text ,
  "fax1" text ,
  "st_name" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_location" add constraint "u_company_location" unique ("co_code", "type", "add1", "add2", "add3", "city", "pin");
CREATE INDEX "idx_company_location_co_code" on "public"."company_location" using btree ("co_code");
CREATE INDEX "idx_company_location_type" on "public"."company_location" using btree ("type");
CREATE INDEX "idx_company_location_city" on "public"."company_location" using btree ("city");
CREATE INDEX "idx_company_location_pin" on "public"."company_location" using btree ("pin");
