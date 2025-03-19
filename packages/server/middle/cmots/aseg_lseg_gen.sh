#!/bin/bash

for i in {1..20}
do
  printf ",,,,,,,,lseg%d,varchar(50),LSEG%d,,\n" "$i" "$i"
  printf ",,,,,,,,lval%d,float,LVAL%d,,\n" "$i" "$i"
done

