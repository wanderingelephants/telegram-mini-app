const { postToGraphQL } = require("../../../lib/helper")
const dbManager = require("./DatabaseManager");
const JavascriptResponseHandler = require("./JavascriptResponseHandler")
const path = require("path")
const fs = require("fs")
const dataFolder = process.env.DATA_ROOT_FOLDER
const MAX_RESULTS_TO_FORMAT = 100

const route = async (req, res) => {
    let result = []
    try{

        const query = `query UserChatHistory($chat_id: Int!, $chat_uuid: uuid!){
  user_chat(where: {id: {_eq: $chat_id},chat_uuid: {_eq: $chat_uuid}}, order_by: {updated_at: asc}){
    chat_uuid
    chat_title
    textContent_user_query
    textContent_assistant_response
    }
}`
const {chat_id, chat_uuid, email} = req.body
        const queryResp  = await postToGraphQL({
            query, variables: {chat_id, chat_uuid}
        })
        console.log("queryResp", queryResp.data.user_chat)
        const {textContent_assistant_response} = queryResp.data.user_chat[0]
                
        const jsManager = new JavascriptResponseHandler(dbManager, null, null, "report", null, {email, chatSessionId: chat_uuid}, false)
        let jsExecResponse = await jsManager.executeJavaScript(textContent_assistant_response);
        res.status(200).json(jsExecResponse.result)
    }
    catch(e){
        console.error(e)
        res.status(500).json([])
    }
}
module.exports = route