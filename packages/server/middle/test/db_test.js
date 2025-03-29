const dbManager = require("../routes/api/chat/DatabaseManager")
const fs = require("fs")
//dbManager.getGraphQLFields(true).then(resp => fs.writeFileSync("fields.txt", JSON.stringify(resp)))
dbManager.initData().then(resp => console.log("done"))