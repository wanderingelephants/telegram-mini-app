const {postToGraphQL} = require("../../../../lib/helper")
const getquote = require("./getquote")
const sendMail = require("../../../../utils/sendMail");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getQueryString = (instruments) => {
    console.log("getQueryString")
    console.log(instruments)
    let querystring = ''
    let count = 0
    for (const instr of instruments) {
        console.log('delta', (instr.trigger * -1) - instr.change)
        const limit_price = (instr.prevClose * (100 - instr.trigger * 1) / 100)
        const amt = instr.base_amt * Math.pow(instr.buy_factor * 1, (instr.trigger * -1) - instr.change)
        console.log("amt", amt)
        const quantity = (amt / limit_price)
        console.log("quantity", quantity)

        querystring += count === 0 ? '?' : '&'
        querystring += 'i=' + instr.symbol + '&quantity=' + quantity.toFixed(0) + '&price=' + limit_price.toFixed(2) + '&reportedPrice=' + instr.price.toFixed(2)
        count++
    }
    return querystring
}
const route = async(req, res) => {
    //const instrList = ["NIFTYBEES", "MID150BEES", "BANKBEES"] //get from db
    //const etfList = await axios.get(process.env.API_SERVER_URL + "/api/mutualfunds/list?isDipSipETF=true")
    //console.log("etfList", etfList.data)
    //const instrList = etfList.data.map(e => e.name)
    //console.log(instrList)
    let userETFPortfolios = []
    let instrList = []
    try{
        const resp = await postToGraphQL({
            query: `query GetUserPortfolioConfigs{
  portfolio_mutual_funds(where: {mutual_fund: {
    isDipSipETF: {_eq: true}}}){
    mutual_fund{
      name
    }
    user{
      email
      user_configs (where: {key: {_eq: "dipsip_etf_config"}}){
        value
      }
    }
  }
}`,
            variables: {}
        })
        userETFPortfolios = resp.data.portfolio_mutual_funds
        instrList = new Set(
            resp.data.portfolio_mutual_funds.map(fund => fund.mutual_fund.name)
          );
    }
    catch(e){
        console.error(e)
    }
    const quotes = await getquote([...instrList])
    console.log("quotes", JSON.stringify(quotes))
    const symbolsToSend = {}
    for (userETFPortfolio of userETFPortfolios){
        try{
            const email = userETFPortfolio.user.email
            if (!symbolsToSend[email]) symbolsToSend[email] = []
            const userMF = userETFPortfolio.mutual_fund.name
            const priceChange = quotes.data[`NSE:${userMF}`].net_change
            const lastPrice = quotes.data[`NSE:${userMF}`].last_price
            const configValue = JSON.parse(userETFPortfolio.user.user_configs[0].value) 
            console.log(userMF, priceChange, email, configValue)
            if (priceChange <= configValue.trigger*1){
                symbolsToSend[email].push({symbol: userMF, change: priceChange, price: lastPrice, trigger: configValue.trigger, base_amt: configValue.base_amt, buy_factor: configValue.buy_factor, prevClose: quotes.data[`NSE:${userMF}`].ohlc.close})
            }
        }
        catch (e){
            console.error(e)
        }
    }
    console.log("symbolsToSend", symbolsToSend)
    for (const email of Object.keys(symbolsToSend)){
        const trade_url_query = getQueryString(symbolsToSend[email])
        console.log(email, trade_url_query)
        if (process.env.WEB_APP_HOST){
            const fullUrl = process.env.WEB_APP_HOST + "/trade" + trade_url_query
            console.log(email, fullUrl)
            await delay(5000)
            await sendMail([email], "Index Fund Price Alert", fullUrl)
        }
        else {
            console.log("process.env.WEB_APP_HOST not defined")
        }
        
    }
    
    res.status(200).json("ok")
}
module.exports = route