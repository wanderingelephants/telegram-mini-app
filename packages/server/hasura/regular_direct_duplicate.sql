WITH fund_variants AS (
    SELECT 
        id,
        name,
        -- Extract the base name by removing " - Direct Plan" or " - Regular Plan"
        TRIM(
            REPLACE(
                REPLACE(name, ' - Direct Plan', ''), 
                ' - Regular Plan', ''
            )
        ) AS base_name,
        -- Flag indicating whether the fund is a Direct variant
        CASE 
            WHEN name LIKE '% - Direct Plan%' THEN TRUE 
            ELSE FALSE 
        END AS is_direct,
        -- Flag indicating whether the fund is a Regular variant
        CASE 
            WHEN name LIKE '% - Regular Plan%' THEN TRUE 
            ELSE FALSE 
        END AS is_regular
    FROM 
        mutual_fund
),
funds_with_both_variants AS (
    SELECT 
        base_name,
        -- Collect the IDs of Direct and Regular variants
        MAX(CASE WHEN is_direct THEN id END) AS direct_id,
        MAX(CASE WHEN is_regular THEN id END) AS regular_id
    FROM 
        fund_variants
    GROUP BY 
        base_name
    HAVING 
        COUNT(DISTINCT CASE WHEN is_direct THEN 1 END) > 0
        AND COUNT(DISTINCT CASE WHEN is_regular THEN 1 END) > 0
)
UPDATE mutual_fund
SET mf_direct_variant_id = funds_with_both_variants.direct_id
FROM funds_with_both_variants
WHERE mutual_fund.id = funds_with_both_variants.regular_id;