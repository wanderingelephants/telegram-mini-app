const dbManager = require("../routes/api/chat/DatabaseManager")
const path = require("path")
const fs = require("fs")
dbManager.getGraphQLFields(true).then(resp => fs.writeFileSync(path.join(process.env.DATA_ROOT_FOLDER, "prompts_fields.json"), JSON.stringify(resp)))
