-- Create company_credit_rating_info table
CREATE TABLE "company_credit_rating_info" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "ratdate" date ,
  "sectype" text ,
  "amount" integer ,
  "rating" text ,
  "ratingby" text ,
  "type" text ,
  "note" text ,
  "stoblig" text ,
  "stattype" text ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_credit_rating_info_co_code_index" on "public"."company_credit_rating_info" using btree ("co_code");
