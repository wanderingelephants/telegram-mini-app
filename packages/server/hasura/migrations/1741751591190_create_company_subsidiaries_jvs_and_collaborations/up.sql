-- Create company_subsidiaries_jvs_and_collaborations table
CREATE TABLE "company_subsidiaries_jvs_and_collaborations" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "lname" text ,
  "coll_name" text ,
  "coll_ctry" text ,
  "coll_country" numeric ,
  "perc_sh" numeric ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_subsidiaries_jvs_and_collaborations_co_code_index" on "public"."company_subsidiaries_jvs_and_collaborations" using btree ("co_code");
