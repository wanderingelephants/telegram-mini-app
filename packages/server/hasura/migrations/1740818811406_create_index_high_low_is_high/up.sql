CREATE  INDEX "high_low_is_high" on
  "public"."fifty_two_week_high_low" using btree ("is_high");
