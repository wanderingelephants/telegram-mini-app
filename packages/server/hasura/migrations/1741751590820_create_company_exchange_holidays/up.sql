-- Create company_exchange_holidays table
CREATE TABLE "company_exchange_holidays" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "holidaydate" date ,
  "purpose" text ,
  "day" text 
);
