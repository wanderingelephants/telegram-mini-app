#sh module_test hasura_test.js
#sh module_test db_test.js
#echo $@
node --env-file=../.env $@