const {postToGraphQL} = require("../lib/helper")

const query = `query users{
    users{
        id
    }
}`
const variables = {}
postToGraphQL({query, variables}).then(resp => console.log(resp.data))