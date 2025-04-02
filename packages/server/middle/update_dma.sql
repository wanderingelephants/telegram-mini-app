CREATE
OR REPLACE FUNCTION public.update_dma() RETURNS SETOF company_price_volume_daily_moving_averages LANGUAGE plpgsql AS $ function $ DECLARE company RECORD;
price_dma_5_value NUMERIC;
price_dma_10_value NUMERIC;
price_dma_20_value NUMERIC;
price_dma_50_value NUMERIC;
price_dma_100_value NUMERIC;
price_dma_200_value NUMERIC;
volume_dma_5_value NUMERIC;
volume_dma_10_value NUMERIC;
volume_dma_20_value NUMERIC;
volume_dma_50_value NUMERIC;
volume_dma_100_value NUMERIC;
volume_dma_200_value NUMERIC;
current_timestamp TIMESTAMPTZ: = NOW();
BEGIN -- Loop through each company in company_master that has price data
FOR company IN
SELECT
  DISTINCT cpv.co_code
FROM
  company_price_volume cpv LOOP -- Calculate price DMAs for various periods
  -- 5-day price DMA
SELECT
  AVG(close) INTO price_dma_5_value
FROM
  (
    SELECT
      close
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      5
  ) AS recent_prices_5;
-- 10-day price DMA
SELECT
  AVG(close) INTO price_dma_10_value
FROM
  (
    SELECT
      close
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      10
  ) AS recent_prices_10;
-- 20-day price DMA
SELECT
  AVG(close) INTO price_dma_20_value
FROM
  (
    SELECT
      close
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      20
  ) AS recent_prices_20;
-- 50-day price DMA
SELECT
  AVG(close) INTO price_dma_50_value
FROM
  (
    SELECT
      close
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      50
  ) AS recent_prices_50;
-- 100-day price DMA
SELECT
  AVG(close) INTO price_dma_100_value
FROM
  (
    SELECT
      close
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      100
  ) AS recent_prices_100;
-- 200-day price DMA
SELECT
  AVG(close) INTO price_dma_200_value
FROM
  (
    SELECT
      close
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      200
  ) AS recent_prices_200;
-- Calculate volume DMAs for various periods
  -- 5-day volume DMA
SELECT
  AVG(volume) INTO volume_dma_5_value
FROM
  (
    SELECT
      volume
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      5
  ) AS recent_volumes_5;
-- 10-day volume DMA
SELECT
  AVG(volume) INTO volume_dma_10_value
FROM
  (
    SELECT
      volume
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      10
  ) AS recent_volumes_10;
-- 20-day volume DMA
SELECT
  AVG(volume) INTO volume_dma_20_value
FROM
  (
    SELECT
      volume
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      20
  ) AS recent_volumes_20;
-- 50-day volume DMA
SELECT
  AVG(volume) INTO volume_dma_50_value
FROM
  (
    SELECT
      volume
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      50
  ) AS recent_volumes_50;
-- 100-day volume DMA
SELECT
  AVG(volume) INTO volume_dma_100_value
FROM
  (
    SELECT
      volume
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      100
  ) AS recent_volumes_100;
-- 200-day volume DMA
SELECT
  AVG(volume) INTO volume_dma_200_value
FROM
  (
    SELECT
      volume
    FROM
      company_price_volume
    WHERE
      co_code = company.co_code
    ORDER BY
      record_date DESC
    LIMIT
      200
  ) AS recent_volumes_200;
-- Check if company already exists in the DMA table
  IF EXISTS (
    SELECT
      1
    FROM
      company_price_volume_daily_moving_averages
    WHERE
      co_code = company.co_code
  ) THEN -- Update existing record
UPDATE
  company_price_volume_daily_moving_averages
SET
  price_dma_5_day = price_dma_5_value,
  price_dma_10_day = price_dma_10_value,
  price_dma_20_day = price_dma_20_value,
  price_dma_50_day = price_dma_50_value,
  price_dma_100_day = price_dma_100_value,
  price_dma_200_day = price_dma_200_value,
  volume_dma_5_day = volume_dma_5_value,
  volume_dma_10_day = volume_dma_10_value,
  volume_dma_20_day = volume_dma_20_value,
  volume_dma_50_day = volume_dma_50_value,
  volume_dma_100_day = volume_dma_100_value,
  volume_dma_200_day = volume_dma_200_value,
  updated_at = current_timestamp
WHERE
  co_code = company.co_code;
  ELSE -- Insert new record
INSERT INTO
  company_price_volume_daily_moving_averages (
    co_code,
    price_dma_5_day,
    price_dma_10_day,
    price_dma_20_day,
    price_dma_50_day,
    price_dma_100_day,
    price_dma_200_day,
    volume_dma_5_day,
    volume_dma_10_day,
    volume_dma_20_day,
    volume_dma_50_day,
    volume_dma_100_day,
    volume_dma_200_day,
    created_at,
    updated_at
  )
VALUES
  (
    company.co_code,
    price_dma_5_value,
    price_dma_10_value,
    price_dma_20_value,
    price_dma_50_value,
    price_dma_100_value,
    price_dma_200_value,
    volume_dma_5_value,
    volume_dma_10_value,
    volume_dma_20_value,
    volume_dma_50_value,
    volume_dma_100_value,
    volume_dma_200_value,
    current_timestamp,
    current_timestamp
  );
END IF;
-- Return the updated or inserted row
RETURN QUERY
SELECT
  *
FROM
  company_price_volume_daily_moving_averages
WHERE
  co_code = company.co_code;
END LOOP;
RETURN;
END;
$ function $