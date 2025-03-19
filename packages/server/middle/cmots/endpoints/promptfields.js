const fs = require("fs")
const path = require("path")
const data = require("../json/all_tables.json")
const mf_data = require(path.join(process.env.DATA_ROOT_FOLDER, "mutual_funds.json"))

const route = async (req, res) => {
    try{
        const promptable = data.filter(c => (c.PromptQL === "Retail" || c.PromptQL === "Enterprise"))
        //console.log(promptable)
        const mappedData = promptable.map(item => ({
            array_name: item["Table Description"].replaceAll(" ", "_"),
            //visibility: item["PromptQL"],
            fields: item.Columns.filter(c => (c.PromptQL !== false)).map(col => col["Column_Name"])
        }));
        const finalData = mf_data.concat(mappedData)
        //console.log(JSON.stringify(mappedData))
        fs.writeFileSync(path.join(process.env.DATA_ROOT_FOLDER, "graphql_fields.txt"), JSON.stringify(finalData))
        res.status(200).json(finalData)
    }
    catch(e){
        res.status(500).json(e)
    }
    
}
module.exports = route