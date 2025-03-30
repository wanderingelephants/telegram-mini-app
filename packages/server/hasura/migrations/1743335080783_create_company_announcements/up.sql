-- Create company_announcements table
CREATE TABLE "company_announcements" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "announcement_record_date" date ,
  "announcement_document_link" text ,
  "announcement_text" text ,
  "announcement_text_summary" text ,
  "announcement_category" text ,
  "announcement_sub_category" text ,
  "announcement_impact" text ,
  "announcement_sentiment" text 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_announcements" add constraint "u_company_announcements" unique ("co_code", "announcement_document_link");
CREATE INDEX "idx_company_announcements_co_code" on "public"."company_announcements" using btree ("co_code");
CREATE INDEX "idx_company_announcements_announcement_record_date" on "public"."company_announcements" using btree ("announcement_record_date");
CREATE INDEX "idx_company_announcements_announcement_document_link" on "public"."company_announcements" using btree ("announcement_document_link");
