const axios = require('axios');
const baseUrl = "http://localhost:3000"
const appRecvUrl = "/api/nse/receive"
//const dataToPost = require('./output.json')

const route = async (req, res) => {
    let mesg = ''
    try{
        await axios.post(baseUrl + appRecvUrl, req.body)
        mesg = 'PUBLISHED'
    }
    catch(e){
        console.log('err in publish',  e)
        mesg = 'Err in publish'
    }
    res.status(200).json(mesg)
}
module.exports = route