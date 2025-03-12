-- Create company_exchange_holidays table
CREATE TABLE "company_exchange_holidays" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "holidaydate" date,
  "purpose" text,
  "day" text
);
ALTER TABLE "public"."company_exchange_holidays" add constraint "company_exchange_holidays_holidaydate" unique ("holidaydate");
CREATE INDEX "idx_company_exchange_holidays_holidaydate" on "public"."company_exchange_holidays" using btree ("holidaydate");
