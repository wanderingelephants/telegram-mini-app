-- Create company_board_of_directors table
CREATE TABLE "company_board_of_directors" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer ,
  "slno" integer ,
  "dir_name" text ,
  "dir_desg" text ,
  "year" integer ,
  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
CREATE INDEX "company_board_of_directors_co_code_index" on "public"."company_board_of_directors" using btree ("co_code");
