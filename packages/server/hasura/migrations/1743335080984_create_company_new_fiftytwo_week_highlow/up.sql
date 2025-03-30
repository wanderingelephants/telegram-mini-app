-- Create company_new_fiftytwo_week_highlow table
CREATE TABLE "company_new_fiftytwo_week_highlow" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "record_date" date ,
  "last_traded_price" numeric ,
  "change_percent" numeric ,
  "new_high_low" numeric ,
  "prev_high_low" numeric ,
  "prev_high_low_record_date" date ,
  "is_high" boolean 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_new_fiftytwo_week_highlow" add constraint "u_company_new_fiftytwo_week_highlow" unique ("co_code", "record_date");
CREATE INDEX "idx_company_new_fiftytwo_week_highlow_co_code" on "public"."company_new_fiftytwo_week_highlow" using btree ("co_code");
CREATE INDEX "idx_company_new_fiftytwo_week_highlow_record_date" on "public"."company_new_fiftytwo_week_highlow" using btree ("record_date");
