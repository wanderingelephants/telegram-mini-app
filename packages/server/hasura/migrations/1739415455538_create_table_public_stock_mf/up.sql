CREATE TABLE "public"."stock_mf" ("id" serial NOT NULL, "company_name" text NOT NULL, "company_sector" text, "symbol" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("company_name"));
