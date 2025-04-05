-- Create company_intraday_oclh_candles_by_minute table
CREATE TABLE "company_intraday_oclh_candles_by_minute" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "datetime_minute" timestamptz ,
  "open" numeric ,
  "high" numeric ,
  "low" numeric ,
  "close" numeric ,
  "volume" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_intraday_oclh_candles_by_minute" add constraint "u_company_intraday_oclh_candles_by_minute" unique ("co_code", "datetime_minute");
CREATE INDEX "idx_company_intraday_oclh_candles_by_minute_co_code" on "public"."company_intraday_oclh_candles_by_minute" using btree ("co_code");
CREATE INDEX "idx_company_intraday_oclh_candles_by_minute_datetime_minute" on "public"."company_intraday_oclh_candles_by_minute" using btree ("datetime_minute");
