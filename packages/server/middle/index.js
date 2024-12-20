const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000;
const cron = require('node-cron');
const getquote = require('./routes/api/kite/instrument/getquote')
cron.schedule('0 12 * * 1-5', async () => {
  console.log('running a task during market hours of NSE', new Date());
  //await getquote(['BANKNIFTY1','MID150CASE','ICICIB22', 'MAFANG', 'NXST-RR', 'GOLDCASE'], true)
}, {timezone: "Asia/Kolkata"});

app.use([
    bodyParser.urlencoded({extended: true}),
    express.json({limit: '1mb'})
]);
app.use('/', require('./routes'));

app.listen(port, () => {
    console.log(`api server running on port: ${port}`)
})
