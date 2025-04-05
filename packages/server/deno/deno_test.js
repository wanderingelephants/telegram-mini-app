

(async () => {
// IN Node.js code
const initResp = await fetch("http://localhost:4123/init", {
    method: "POST"
});
console.log(await initResp.json())
/*const functionText = `async function analysis(pre_populated_arrays){
    // User Question: which companies have FCF Margin above 50%
    // The question is about FCF Margin, so the relevant array is company_yearly_ratios
    let company_yearly_ratios = pre_populated_arrays.company_yearly_ratios;

    // Filter out records where FCF_Margin is not available or is zero
    let valid_fcf_margin_ratios = company_yearly_ratios.filter(ratio => ratio.FCF_Margin !== null && ratio.FCF_Margin !== undefined && ratio.FCF_Margin !== 0);

    // Filter for companies with FCF Margin above 50%
    let companies_above_50_fcf_margin = valid_fcf_margin_ratios.filter(ratio => ratio.FCF_Margin > 50);

    // Sort the results by FCF Margin in descending order
    let sorted_companies = companies_above_50_fcf_margin.sort((a, b) => b.FCF_Margin - a.FCF_Margin);

    // Map the results to include only relevant fields
    let result = sorted_companies.map(company => ({
        company_name: company.company_name,
        company_nse_symbol: company.company_nse_symbol,
        company_sector: company.company_sector,
        company_market_cap_in_crores: company.company_market_cap_in_crores,
        company_market_cap_category: company.company_market_cap_category,
        FCF_Margin: company.FCF_Margin,
        YearEnd: company.YearEnd
    }));

    return result;
}
`*/
const functionText = `async function analysis(pre_populated_arrays){
try{
const  query = \`query GetAnnouncementsForSearchTerms {
  company_announcements {
    company_master{
        company_name: companyname
        company_nse_symbol: nsesymbol
        company_sector: sectorname
        company_market_cap_in_crores: mcap
        company_market_cap_category: mcaptype
    }
    announcement_document_link
    announcement_record_date
  }
}\`
    const resp = await postToGraphQL({
        query: query,
        variables: {}
    })
        return resp.data.company_announcements
}
catch(e){
console.error(e)
return e
}

}
`
const fnResp = await fetch("http://localhost:4123/exec", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ functionText }),
});    
console.log("fnResp", await fnResp.json())
})();