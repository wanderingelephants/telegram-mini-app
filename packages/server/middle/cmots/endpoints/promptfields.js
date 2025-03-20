const fs = require("fs")
const path = require("path")
const data = require("../json/all_tables.json")
let mf_data = require(path.join(process.env.DATA_ROOT_FOLDER, "mutual_funds.json")).filter(c => (c.PromptQL === "Retail" || c.PromptQL === "Enterprise"));

const route = async (req, res) => {
    if (!req.query.forDisplay){
        res.status(500).json("forDisplay=true/false query param mandatory")
        return 
    }
    try{
        const forDisplay = "true" ===  req.query.forDisplay.toLowerCase() ? true : false
        console.log("forDisplay", forDisplay)
        let promptable = data.filter(c => (c.PromptQL === "Retail" || c.PromptQL === "Enterprise"))

        let table_identifier = "Table Name"
        let mappedData;
        
        if (forDisplay){
            promptable = promptable.filter(c => c["Table Name"] !== "company_master")
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
        
        
        //const promptable = data.filter(c => (c["Table Name"] === "company_master"))
        //console.log(promptable)
        /*const mapped_column = forDisplay === true ? "GQL_Alias" :  "Column_Name"
        const mappedData = promptable.map(item => {
            const fields = item.Columns.filter(c => (c.GQL_Alias && c.GQL_Alias !== "" && c.GQL_Alias !== "co_code")).map(col => col[mapped_column])
            if (forDisplay === false) fields.push("co_code")
            return {
            array_name: item[`${forDisplay === true ? "Table Description": "Table Name"}`].replaceAll(" ", "_"),
            //visibility: item["PromptQL"],
            fields
            }
        });*/
        const finalData = mf_data.concat(mappedData)
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