const { postToGraphQL } = require("../../../lib/helper")

const route = async(req, res) => {
    const chat_uuid = req.body.chat_uuid
    const email = req.user.email
    try{
        const resp = await postToGraphQL({
            query: `query UserChatHistory($chat_uuid: uuid!, $email: String!){
  user_chat(where: {chat_uuid: {_eq: $chat_uuid}, user:{email: {_eq: $email}}}, order_by: {updated_at: asc}){
    chat_uuid
    chat_title
    textContent_user_query
    textContent_assistant_formatted_response
  }
}`,
            variables: {
                chat_uuid, email
            }
        })
        if (resp.data.user_chat.length > 0){
            const writeResp = await postToGraphQL({
                query: `mutation insertUserChatShare($object: user_chat_share_insert_input!){
                    insert_user_chat_share_one(object: $object, on_conflict: {
                      constraint: user_chat_share_chat_uuid_textContent_user_query_key,
                      update_columns: [textContent_user_query, textContent_assistant_formatted_response]
                    }){
                      chat_uuid
                    }
                  }`,
                  variables: {
                      "object": {
                          "chat_uuid": resp.data.user_chat[0].chat_uuid,
                          "chat_title": resp.data.user_chat[0].chat_title,
                          "textContent_user_query": resp.data.user_chat[0].textContent_user_query,
                          "textContent_assistant_formatted_response": resp.data.user_chat[0].textContent_assistant_formatted_response,
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
            })
            res.status(200).json({"url": process.env.WEB_APP_HOST + "/share/" + writeResp.data.insert_user_chat_share_one.chat_uuid})
        }
    }
    catch(e){
        console.error(e)
        res.status(500).json("Error in Share")
    }
}
module.exports = route