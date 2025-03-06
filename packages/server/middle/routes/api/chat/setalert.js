const { postToGraphQL } = require("../../../lib/helper")

const route = async(req, res) => {
    const chat_uuid = req.body.chat_uuid
    const chat_id = req.body.chat_id
    console.log("Set Alert for ", chat_uuid, chat_id)
    res.status(200).json("alert was set")
}
module.exports = route