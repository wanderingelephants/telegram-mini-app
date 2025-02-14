const axios = require("axios")
const processSummaries = require('./processSummaries');

const route = async(req, res) => {
    //"13-02-2025"
    const apiServer = process.env.API_SERVER
    const summaryDate = req.query.summaryDate
    const index = req.query.index
    if (!summaryDate || !index) res.status(500).json("specify summaryDate and index=equities/sme")
    await axios.post(`http://${apiServer}/api/nse/announcements`, {
        fromDate: summaryDate,
        toDate: summaryDate,
        index,
    })
    const announcement_data_folder = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD
    const toks = summaryDate.split("-")
    const formattedDate = toks[2] + "/" + toks[1] + "/" + toks[0]
    await axios.post(process.env.PDF_PROCESS_URL + `/api/processPDFs?inputFolder=${formattedDate}&outputFolder=${formattedDate}`)
    await processSummaries(announcement_data_folder+"/to_text/" + formattedDate, announcement_data_folder+"/summaries/" + formattedDate)
    res.status(200).json("ok")
}
module.exports = route