const axios = require('axios')
const kiteHoldingsUrl = 'https://kite.zerodha.com/oms/portfolio/holdings'
const dipsipList = ['MID150CASE', 'ICICIB22', 'BANKNIFTY1']
const auth_headers = require('./auth_headers.json')
console.log(auth_headers)
async function getHoldings(){
    const resp = await axios.get(kiteHoldingsUrl, {
        headers: {
            'accept':'application/json, text/plain, */*',
    'accept-encoding':'gzip, deflate, br, zstd',
    'accept-language':'en-US,en-IN;q=0.9,en-GB;q=0.8,en;q=0.7,hi;q=0.6',
    'priority':'u=1, i',
    'authorization':'enctoken vyaFeJUzhSiirk9GmAkltemGAZZrcfy6dFxR9Gge2ZPsd+rYScnQlvFfYTxZhPUP9b9WL5xZRDgFDlxHn+gZfhZXaF0Xj9MBCCEbXhKjIi82dXzf+DXUlw==',
    'cookie':'signup_csrftoken=JdtDoAL34B1XxEzkLpXO26JwB1qi4GBE2sAWeYuYOSbDCCrPd0jzPrPoIyumh0Hc; WZRK_G=c8e8a4f2106f49a490636cbd375c7508; _ga_X88LHJCZCR=GS1.1.1698392313.3.0.1698392313.60.0.0; _ga=GA1.2.1530296571.1685684066; AMP_MKTG_d9d4ec74fa=JTdCJTdE; AMP_d9d4ec74fa=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjJiOTcxNTdhZi02Yjc5LTQ4YTAtYmJjNi0wYzc3ZjQyZWY3NjUlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzAzNDIyODUyMzczJTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTcwMzQyMjk1MTM5MCUyQyUyMmxhc3RFdmVudElkJTIyJTNBMTglN0Q=; _ga_Y19MKQM0YF=GS1.2.1727687619.7.0.1727687619.0.0.0; kf_session=rKIlkuewSf00PMohOacB80oBUBo124g6; user_id=DS8262; _cfuvid=Hu9yGu_srDHqyZBtOLUO_VEs2JZZmO2lTBX7OfcSgGQ-1731402864506-0.0.1.1-604800000; public_token=1jf9nEA7U0Oih58dRLhYfpQrbn7IBwAz; enctoken=vyaFeJUzhSiirk9GmAkltemGAZZrcfy6dFxR9Gge2ZPsd+rYScnQlvFfYTxZhPUP9b9WL5xZRDgFDlxHn+gZfhZXaF0Xj9MBCCEbXhKjIi82dXzf+DXUlw==; __cf_bm=WEh6PZFEpAtiNz1iLp_R7R1m4t4hfWXs6IoU2q0kuBw-1731556444-1.0.1.1-poSkk3KpgYG7myDnJ6pSi.N3yRdpfckE5IolJORX8sr.qrkyk3Q9bwJaRr_OiVetXwTI_T8Kp92Jl.4QlwLqpg',
    'if-none-match':'W/"4seSHz0TJ1UE89W9"',
    'referer':'https//kite.zerodha.com/dashboard',
    'sec-ch-ua':'"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
    'sec-ch-ua-mobile':'?0',
    'sec-ch-ua-platform':'"macOS"',
    'sec-fetch-dest':'empty',
    'sec-fetch-mode':'cors',
    'sec-fetch-site':'same-origin',
    'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'x-kite-app-uuid':'c26e28e5-71b7-4914-b94b-d7129a4dd502',
    'x-kite-userid':'DS8262',
    'x-kite-version':'3.0.0'
        }
    })
    //console.log(resp.data.data)
    for (instr of dipsipList){
        console.log(instr)
        const instrDataArr = resp.data.data.filter(d => d.tradingsymbol===instr)
        if (instrDataArr.length == 1){
            const instrData = instrDataArr[0]
            console.log(instrData.last_price, instrData.close_price) 
        }
    }
}
getHoldings()