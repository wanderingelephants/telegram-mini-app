-- Create company_board_of_directors table
CREATE TABLE "company_board_of_directors" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "slno" integer ,
  "dir_name" text ,
  "dir_desg" text ,
  "year" integer 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_board_of_directors" add constraint "u_company_board_of_directors" unique ("co_code", "slno", "year");
CREATE INDEX "idx_company_board_of_directors_co_code" on "public"."company_board_of_directors" using btree ("co_code");
CREATE INDEX "idx_company_board_of_directors_slno" on "public"."company_board_of_directors" using btree ("slno");
CREATE INDEX "idx_company_board_of_directors_year" on "public"."company_board_of_directors" using btree ("year");
