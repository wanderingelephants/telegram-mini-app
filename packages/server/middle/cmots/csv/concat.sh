#ls -l *csv | awk 'NR>1 {print "cat " $NF ">>all.csv"}' 

> all.csv

cat master.csv >> all.csv
echo "" >> all.csv

tail -n +2 company_profile.csv >> all.csv
echo "" >> all.csv

tail -n +2  shareholding.csv >> all.csv
echo "" >> all.csv

tail -n +2  standalone_ratios.csv >> all.csv
echo "" >> all.csv
