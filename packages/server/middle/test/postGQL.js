const {postToGraphQL} = require("../lib/helper/index")
const query = `query stock{
  stock(where : {symbol: {_eq: "CALSOFT"}}){
    id
    company_name
    company_sector
    instrument_token
    exchange_token
  }
}`
const variables = {}
postToGraphQL({
    query,
    variables
}).then(resp => console.log(resp.data))

