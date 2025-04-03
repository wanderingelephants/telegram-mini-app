const all_tables_json = require(process.env.DATA_ROOT_FOLDER + "/prompts_fields.json")
//console.log(all_tables_json)
const ignoredFields = new Set(["company_name","company_nse_symbol","company_sector","company_market_cap_in_crores","company_market_cap_category","year","month","quarter"]);

const fieldMap = new Map();

// Populate fieldMap with field occurrences
all_tables_json.forEach(({ array_name, fields }) => {
    if (Array.isArray(fields)){
        fields.forEach(field => {
            if (!ignoredFields.has(field)) {
                if (!fieldMap.has(field)) {
                    fieldMap.set(field, []);
                }
                fieldMap.get(field).push(array_name);
            }
        });
    }
    else console.log("Non Array fields", array_name)
   
});

// Filter to keep only duplicate fields
const duplicateFields = [];
for (const [field, arrays] of fieldMap.entries()) {
    if (arrays.length > 1) {
        duplicateFields.push({ field, found_in_arrays: arrays });
    }
}

console.log(JSON.stringify(duplicateFields, null, 2));