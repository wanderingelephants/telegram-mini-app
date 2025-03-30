-- Create company_subsidiaries_jvs_collaborations table
CREATE TABLE "company_subsidiaries_jvs_collaborations" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "lname" text ,
  "coll_name" text ,
  "coll_ctry" text ,
  "coll_country" text ,
  "perc_sh" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_subsidiaries_jvs_collaborations" add constraint "u_company_subsidiaries_jvs_collaborations" unique ("co_code", "coll_name", "coll_ctry", "coll_country", "perc_sh");
CREATE INDEX "idx_company_subsidiaries_jvs_collaborations_co_code" on "public"."company_subsidiaries_jvs_collaborations" using btree ("co_code");
CREATE INDEX "idx_company_subsidiaries_jvs_collaborations_coll_name" on "public"."company_subsidiaries_jvs_collaborations" using btree ("coll_name");
CREATE INDEX "idx_company_subsidiaries_jvs_collaborations_coll_ctry" on "public"."company_subsidiaries_jvs_collaborations" using btree ("coll_ctry");
CREATE INDEX "idx_company_subsidiaries_jvs_collaborations_coll_country" on "public"."company_subsidiaries_jvs_collaborations" using btree ("coll_country");
CREATE INDEX "idx_company_subsidiaries_jvs_collaborations_perc_sh" on "public"."company_subsidiaries_jvs_collaborations" using btree ("perc_sh");
