SELECT 
    regular.id AS regular_id,
    regular.name AS regular_name,
    direct.id AS direct_id,
    direct.name AS direct_name
FROM 
    mutual_fund AS regular
JOIN 
    mutual_fund AS direct
ON 
    regular.mf_direct_variant_id = direct.id
WHERE 
    regular.name LIKE '% - Regular Plan%'
ORDER BY 
    regular.name;