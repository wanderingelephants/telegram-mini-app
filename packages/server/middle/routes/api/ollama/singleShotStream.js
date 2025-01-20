const sendPrompt = require('./send_prompt.js')
const model = process.env.OLLAMA_MODEL
const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const route = async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    try {
        const { messages } = req.body;
        const latestMessage = messages[messages.length - 1]

        let userQuery, json;
        if (latestMessage.role == 'user') {
            userQuery = latestMessage.content
            const response = await sendPrompt(model, "mutual_funds_prompt.txt", userQuery)
            obj = JSON.parse(response);
            let json
            if (obj && obj.SQL_Can_Answer === "YES") {
                let sqlQuery = obj.SQL
                sqlQuery = sqlQuery.replaceAll("```sql", "")
                sqlQuery = sqlQuery.replaceAll("```", "")
                console.log(sqlQuery)
                const queryResp = db.prepare(`${sqlQuery}`).all()

                console.log("DB Resp", queryResp)
                let headerLine, json;
                let empty_line = { "response": "\n\n", "done": false }
                if (queryResp.length == 0){
                    if (obj.General_Answer == "")
                        headerLine = "No Results"
                    else headerLine = obj.General_Answer
                } 
                else {
                    headerLine = Object.keys(queryResp[0]).join()
                headerLine = headerLine.replace("mutual_fund_name", "FUND")
                headerLine = headerLine.replace("mutual_fund_category", "CATEGORY")
                headerLine = headerLine.replace("company_stock_name", "STOCK")
                headerLine = headerLine.replace("stock_sector", "SECTOR")
                headerLine = headerLine.replace("stock_holding_in_percentage", "HOLDING")
                headerLine = headerLine.replace("mutual_fund_returns", "RETURNS")
                headerLine = headerLine.replace("mutual_fund_star_rating", "RATING")

                } 
                json = { "response": headerLine, "done": false }
                res.write(`data: ${JSON.stringify(json)}\n\n`);
                res.write(`data: ${JSON.stringify(empty_line)}\n\n`);
                for (let i = 0; i < queryResp.length; i++) {
                    let data = Object.values(queryResp[i])
                    if (typeof (data) === 'number') data = data.toFixed(2)
                    json = { "response": data, "done": false }
                    res.write(`data: ${JSON.stringify(json)}\n\n`);
                    res.write(`data: ${JSON.stringify(empty_line)}\n\n`);
                }
                json = { "response": "", "done": true }
                res.write(`data: ${JSON.stringify(json)}\n\n`);
                res.end();
                return;
                //json = {"response": obj.SQL, "done": true}
            }
            else if (obj && obj.General_Answer) json = { "response": obj.General_Answer, "done": true }
            else json = { "response": "Sorry, No Response", "done": true }
            console.log("json sending", json)
            res.write(`data: ${JSON.stringify(json)}\n\n`);
            res.end();
        }
    }
    catch (e) {
        console.log('singleShotStream error', e)
        if (obj.General_Answer == "")
            json = { "response": "Sorry, No Response", "done": true }
        else 
            json = { "response": obj.General_Answer, "done": true }
        res.write(`data: ${JSON.stringify(json)}\n\n`);
        res.end();
    }
}
module.exports = route