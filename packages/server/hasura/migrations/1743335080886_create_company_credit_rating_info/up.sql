-- Create company_credit_rating_info table
CREATE TABLE "company_credit_rating_info" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "ratdate" date ,
  "sectype" text ,
  "amount" integer ,
  "rating" text ,
  "ratingby" text ,
  "type" text ,
  "note" text ,
  "stoblig" text ,
  "stattype" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_credit_rating_info" add constraint "u_company_credit_rating_info" unique ("co_code", "ratdate", "sectype", "amount", "rating", "ratingby", "type", "stattype");
CREATE INDEX "idx_company_credit_rating_info_co_code" on "public"."company_credit_rating_info" using btree ("co_code");
CREATE INDEX "idx_company_credit_rating_info_ratdate" on "public"."company_credit_rating_info" using btree ("ratdate");
CREATE INDEX "idx_company_credit_rating_info_sectype" on "public"."company_credit_rating_info" using btree ("sectype");
CREATE INDEX "idx_company_credit_rating_info_rating" on "public"."company_credit_rating_info" using btree ("rating");
CREATE INDEX "idx_company_credit_rating_info_ratingby" on "public"."company_credit_rating_info" using btree ("ratingby");
CREATE INDEX "idx_company_credit_rating_info_type" on "public"."company_credit_rating_info" using btree ("type");
CREATE INDEX "idx_company_credit_rating_info_stattype" on "public"."company_credit_rating_info" using btree ("stattype");
