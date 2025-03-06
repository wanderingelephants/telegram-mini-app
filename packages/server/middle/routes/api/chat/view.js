const { postToGraphQL } = require("../../../lib/helper")

const route = async(req, res) => {
    console.log("chat view", req.query)
    const chat_uuid = req.query.chat_uuid
    const query = `query UserChatHistory($chat_uuid: uuid!){
        user_chat(where: {chat_uuid: {_eq: $chat_uuid}}, order_by: {updated_at: asc}){
          chat_uuid
          chat_title
          textContent_user_query
          textContent_assistant_formatted_response
          created_at
          updated_at
        }
      }`
      try{
        const resp = await postToGraphQL({
            query, 
            variables: {chat_uuid}
        })
        res.status(200).json(resp.data.user_chat)
      }
      catch(e){
        console.error(e)
        res.status(500).json([])
      }
}

module.exports = route