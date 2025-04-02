-- Create company_price_volume_daily_moving_averages table
CREATE TABLE "company_price_volume_daily_moving_averages" (
  id SERIAL PRIMARY KEY,
  "created_at" timestamptz ,
  "updated_at" timestamptz ,
  "co_code" integer  not null,
  "price_dma_5_day" numeric ,
  "price_dma_10_day" numeric ,
  "price_dma_20_day" numeric ,
  "price_dma_50_day" numeric ,
  "price_dma_100_day" numeric ,
  "price_dma_200_day" numeric ,
  "volume_dma_5_day" numeric ,
  "volume_dma_10_day" numeric ,
  "volume_dma_20_day" numeric ,
  "volume_dma_50_day" numeric ,
  "volume_dma_100_day" numeric ,
  "volume_dma_200_day" numeric 
,  FOREIGN KEY ("co_code") REFERENCES "company_master" (co_code) ON UPDATE restrict ON DELETE restrict
);
ALTER TABLE "public"."company_price_volume_daily_moving_averages" add constraint "u_company_price_volume_daily_moving_averages" unique ("co_code");
CREATE INDEX "idx_company_price_volume_daily_moving_averages_co_code" on "public"."company_price_volume_daily_moving_averages" using btree ("co_code");
