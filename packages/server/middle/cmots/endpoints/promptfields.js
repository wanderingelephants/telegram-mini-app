const fs = require("fs")
const path = require("path")
const data = require(path.join(process.env.DATA_ROOT_FOLDER, "all_tables.json"));
const { postToGraphQL } = require("../../lib/helper");
let mf_data = require(path.join(process.env.DATA_ROOT_FOLDER, "mutual_funds.json")).filter(c => (c.PromptQL === "Retail" || c.PromptQL === "Enterprise"));

const route = async (req, res) => {
    if (!req.query.forDisplay){
        res.status(500).json("forDisplay=true/false query param mandatory")
        return 
    }
    try{
        const forDisplay = "true" ===  req.query.forDisplay.toLowerCase() ? true : false
        console.log("forDisplay", forDisplay)
        let promptable = data.filter(c => (c["Table Name"].toLowerCase().indexOf("_ratio") > -1))
        console.log("promptable", promptable.length)
        let table_identifier = "Table Name"
        let mappedData;
        
        if (forDisplay){
            mf_data = mf_data.map(({array_name, fields, PromptQL})=>({array_name, fields, PromptQL}))
            table_identifier = "Table Description"
            mappedData = promptable.map(item => {
                return {
                    PromptQL: item.PromptQL,
                    array_name: item[table_identifier],
                    fields: item.Columns.filter(c => (c.GQL_Alias && c.GQL_Alias !== "" && c.GQL_Alias !== "co_code")).map(col => col["GQL_Alias"])
                    }
            })
        } 
        else {
            mappedData = promptable.map(item => {
                return {
                    array_name: item[table_identifier],
                    fields: item.Columns.filter(c => (c.GQL_Alias && c.GQL_Alias !== "")).map(col => col["GQL_Alias"])
                  }
            })
        }
        let finalData = [];
        finalData = mf_data.concat(mappedData);
        //console.log(finalData)
        for (const fin of ["balance_sheet", "cash_flow", "profit_and_loss"]){
            const distinctKeysQuery = `query {company_${fin}(distinct_on: key) {key}}`
            const resp = await postToGraphQL({query: distinctKeysQuery, variables: {}})
            const fields = resp.data[`company_${fin}`].filter(r =>  r.key !== "").map(r => r.key.trim())
            console.log(Array.isArray(finalData), finalData.length)
            forDisplay ? finalData.push({PromptQL: 'Retail', array_name: fin, fields}) : finalData.push({array_name: fin, fields})
        }
        
        //finalData = mf_data.concat(mappedData)
        //console.log(JSON.stringify(mappedData))
        if (forDisplay === false)  fs.writeFileSync(path.join(process.env.DATA_ROOT_FOLDER, "graphql_fields.txt"), JSON.stringify(finalData))
        res.status(200).json(finalData)
    }
    catch(e){
        console.error(e)
        res.status(500).json(e)
    }
    
}
module.exports = route