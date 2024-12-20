function getLimitPrice(last_price, close, trigger, base_amt, buy_factor) {
    const percentageOverClose = (last_price - close) * 100 / close
    const limit_price = (close * (100 - trigger * 1) / 100)
    const amt = base_amt * Math.pow(buy_factor * 1, (trigger * -1) - percentageOverClose)
    const quantity = (amt / limit_price)
    console.log(close, last_price, percentageOverClose.toFixed(2), trigger, base_amt, amt.toFixed(2), buy_factor, limit_price.toFixed(2), quantity.toFixed(0))
}
const last_price = 535.56
const close = 560.65
base_amt = 10000
buy_factor = 1.33

for (let trigger = 1; trigger < 10; trigger++) {
    for (let lp = 554; lp > 500; lp--) {
        getLimitPrice(lp, close, trigger, base_amt, buy_factor)
    }
}
