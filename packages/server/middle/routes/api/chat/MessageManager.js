const path = require('path');
const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const { postToGraphQL } = require("../../../lib/helper")
const _getFilePath = function (basePath, chatSessionId, activity, filename) {
    const date = new Date();
    const year = date.getFullYear() + "";
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return path.join(basePath, year, month, day, chatSessionId, activity, filename);
}

const _ensureDirectory = async function (filePath) {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
}
const userChatHistoryQuery = `query UserChatHistory($chat_uuid: uuid!){
    user_chat(where: {chat_uuid: {_eq: $chat_uuid}}, order_by: {updated_at: asc}){
      chat_uuid
      chat_title
      textContent_user_query
      textContent_assistant_response
      textContent_execution_result
      textContent_assistant_formatted_response
      created_at
      updated_at
    }
  }`
class MessageManager {
    constructor(basePath) {
        this.basePath = basePath;
    }
    async updateGQL(chat_uuid, chat_title, email, user_query, assistant_response, execution_result, assistant_formatted_response, isFirst) {
        const chat_hash = crypto.createHash('md5').update(JSON.stringify({
            "chat_uuid": chat_uuid,
                "chat_title": chat_title,
                "textContent_user_query": user_query,
                "textContent_assistant_response": assistant_response,
                "textContent_execution_result": execution_result,
                "textContent_assistant_formatted_response": assistant_formatted_response,
                isFirst
        })).digest('hex'); //instead of having a unique composite key comprising all columns, just hash the whole object, and have unique key on the hash 
        const query = `mutation insertUserChat($object: user_chat_insert_input!){
  insert_user_chat_one(object: $object, on_conflict: {
    constraint: user_chat_chat_hash_key,
    update_columns: [updated_at]
  }){
    id
    chat_uuid
  }
}`
        const variables = {
            "object": {
                "chat_uuid": chat_uuid,
                "chat_title": chat_title,
                "textContent_user_query": user_query,
                "textContent_assistant_response": assistant_response,
                "textContent_execution_result": execution_result,
                "textContent_assistant_formatted_response": assistant_formatted_response,
                isFirst,
                chat_hash,
                "updated_at": new Date(),
                "user": {
                    "data": {
                        "email": email,
                        "google_id": ""
                    }, "on_conflict": {
                        "constraint": "users_email_key",
                        "update_columns": ["email"]
                    }
                }

            }
        }
        const resp = await postToGraphQL({ query, variables })
        return resp
    }
    async saveMessage(chatSessionId, activity, message, filename) {
        const filePath = _getFilePath(this.basePath, chatSessionId, activity, filename);
        await _ensureDirectory(filePath);

        let messages = [];
        if (fs.existsSync(filePath)) {
            try {
                const data = await readFile(filePath, 'utf-8');
                messages = JSON.parse(data);
            } catch (err) {
                console.log("err in saveMessage", err)
                //if (err.code !== 'ENOENT') throw err;
            }
        }

        messages.push(message);
        await writeFile(filePath, JSON.stringify(messages, null, 2));
    }
    async getMessages(chatSessionId, activity, filename) {
        const filePath = _getFilePath(this.basePath, chatSessionId, activity, filename);
        let messages = [];
        if (fs.existsSync(filePath)) {
            try {
                const data = await readFile(filePath, 'utf-8');
                messages = JSON.parse(data);
            } catch (err) {
                console.log("err in getMessages", err)
            }
        }
        return messages
    }
    async getFormatterMessages(chatSessionId) {
        const variables = { "chat_uuid": chatSessionId }
        const resp = await postToGraphQL({
            query: userChatHistoryQuery, variables
        })
        const chatRecords = resp.data.user_chat
        const messages = []
        for (let idx=0;  idx<chatRecords.length; idx++) {
            const record = chatRecords[idx]
            const userMessage = "This is the latest User Question : " + record.textContent_user_query
            `This is the ${idx === 0 ? "": "latest"} User Question: ${record.textContent_user_query}\n
                              and in response, system generated this Result: ${record.textContent_execution_result}
                              Output only your formatted response text, and nothing else. `
            const finalMessage = userMessage//idx === 0 ? userMessage : "Result of previous Function Execution was : " + chatRecords[idx - 1].textContent_execution_result + "\n" + userMessage
            messages.push({
                "role": "user",
                "content": [{
                    "type": "text",
                    "text": finalMessage
                }]
            })
            if (idx > 0 && record.textContent_assistant_formatted_response !== null)
            messages.push({
                "role": "assistant",
                "content": [{
                    "type": "text",
                    "text": record.textContent_assistant_formatted_response
                }]
            })
        }
        return messages;

    }
    async getChatMessages(chatSessionId) {
        const variables = { "chat_uuid": chatSessionId }
        const resp = await postToGraphQL({
            query: userChatHistoryQuery, variables
        })
        const chatRecords = resp.data.user_chat
        const allMessages = {
            "user_chats": [],
            "results": [],
            "formatted_responses": []
        }
        for (let idx=0;  idx<chatRecords.length; idx++) {
            const record = chatRecords[idx]
            const userQueryPrevResult = ""//idx > 0 ? `Result of Previous User Query was :  ${chatRecords[idx - 1].textContent_execution_result} .\n Latest User Question: ` : ""
            allMessages["user_chats"].push({
                "role": "user",
                "content": [{
                    "type": "text",
                    "text": `${userQueryPrevResult} ${record.textContent_user_query}`
                }]
            })
            allMessages["user_chats"].push({
                "role": "assistant",
                "content": [{
                    "type": "text",
                    "text": record.textContent_assistant_response
                }]
            })
            allMessages["results"].push({
                result: record.textContent_execution_result
            })
            allMessages["formatted_responses"].push({
                "role": "user",
                "content": [{
                    "type": "text",
                    "text": `This is the User Question: ${record.textContent_user_query} . In response to the Question, the system generated this data: ${record.textContent_execution_result} . \n Output only your formatted response text, and nothing else. `
                }]
            })
            allMessages["formatted_responses"].push({
                "role": "assistant",
                "content": [{
                    "type": "text",
                    "text": record.textContent_assistant_formatted_response
                }]
            })
        }
        return allMessages;
    }
    async getLastMessage(chatSessionId, activity, filename) {
        const filePath = _getFilePath(this.basePath, chatSessionId, activity, filename);
        let messages = [];
        if (fs.existsSync(filePath)) {
            try {
                const data = await readFile(filePath, 'utf-8');
                messages = JSON.parse(data);
            } catch (err) {
                console.log("error in getLastMessage", err)
                //console.error(err)
                return []
            }
        }
        return messages.length > 0 ? messages[messages.length - 1] : []
    }


}
module.exports = MessageManager  