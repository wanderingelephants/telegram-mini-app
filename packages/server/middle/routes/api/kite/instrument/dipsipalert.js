const {postToGraphQL} = require("../../../../lib/helper")
const getquote = require("./getquote")
const sendMail = require("../../../../utils/sendMail");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const formatEmail = (fullUrl) => {
    emailBody = `
            <h1 style="font-weight: bold; font-size: 24px;">Index Fund Price Alert</h1>
        `;
    emailBody += `<div style="margin: 10px 0;">
    <strong>Index Funds Correction</strong><br/>
    <a href="${fullUrl}" style="color: #0066cc;">Place Order</a>
</div>`   
emailBody += 
`
        <div style="background-color: #fff3e6; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 10px;">💡</span>
                <h2 style="font-weight: bold; font-size: 20px; margin: 0;">Did You Know ?</h2>
            </div>
            <p style="margin: 10px 0;">
                On <a href="https://dipsip.co.in/stocks" style="color: #0066cc; text-decoration: underline;">DipSip.co.in</a>, 
                you can search for hidden gems by making nested and complex queries.<br/><br/>
                <em>For example:</em> "Which companies made positive announcements last week, and whose stock price went up next day, 
                and is now below the announcement day price"
            </p>
        </div>
    `;
return emailBody
}
const getQueryString = (instruments) => {
    console.log("getQueryString")
    console.log(instruments)
    let querystring = ''
    let count = 0
    for (const instr of instruments) {
        console.log('delta', (instr.trigger * -1) - instr.change_percent)
        const limit_price = (instr.prevClose * (100 - instr.trigger * 1) / 100)
        const amt = instr.base_amt * Math.pow(instr.buy_factor * 1, (instr.trigger * -1) - instr.change_percent)
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
    console.log(userETFPortfolios)
    const symbolsToSend = {}
    for (userETFPortfolio of userETFPortfolios){
        try{
            const email = userETFPortfolio.user.email
            if (userETFPortfolio.user.user_configs.length === 0){
                console.log("User not subscribed", email)
                continue
            }
            if (!symbolsToSend[email]) symbolsToSend[email] = []
            const userMF = userETFPortfolio.mutual_fund.name
            const closePrice = quotes.data[`NSE:${userMF}`].ohlc.close
            const lastPrice = quotes.data[`NSE:${userMF}`].last_price
            const change_percent = ((lastPrice - closePrice) * 100 / closePrice)
            const configValue = JSON.parse(userETFPortfolio.user.user_configs[0].value) 
            console.log(userMF, change_percent, email, configValue)
            if (change_percent <= configValue.trigger*-1){
                symbolsToSend[email].push({symbol: userMF, change_percent, price: lastPrice, trigger: configValue.trigger, base_amt: configValue.base_amt, buy_factor: configValue.buy_factor, prevClose: quotes.data[`NSE:${userMF}`].ohlc.close})
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
            console.log("sendMail", email, fullUrl)
            const emailBody = formatEmail(fullUrl)
            console.log(emailBody)
            await sendMail([email], "DipSIP Index Fund Price Alert", emailBody)
        }
        else {
            console.log("process.env.WEB_APP_HOST not defined")
        }
        
    }
    
    res.status(200).json("ok")
}
module.exports = route