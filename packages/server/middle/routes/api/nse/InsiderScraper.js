const NSEScraper = require("./NSEScraper");

class InsiderScraper extends NSEScraper{
    constructor(pdfsToDownload, isMaster, announcement_url){
        super(pdfsToDownload, isMaster, announcement_url)
    }
    async processTableData(tableData, keys){
        console.log("InsiderScraper", tableData, keys)
        let documentLinks = {}
        keys.forEach(k => documentLinks[k] = [])
        for (const index of keys) {
            for (const announcement of tableData[index]) {
                const [year, month, day] = extractDateComponents(announcement["BROADCAST DATE/TIME"]);
                const targetPath = path.join(this.storage_dir, year, month, day, index, "pdf")
                fs.mkdirSync(targetPath, { recursive: true })
                if (announcement.SUBJECT.toLowerCase().indexOf("newspaper") > -1) {
                    console.log("Skipping newspaper record", announcement.ATTACHMENT)
                    continue;
                }
                if (announcement.ATTACHMENT && announcement.ATTACHMENT.endsWith(".pdf")) {
                    console.log("Skipping PDF announcement", announcement.ATTACHMENT)
                    continue;
                }
                if (announcement.ATTACHMENT) {
                    documentLinks[index].push(announcement.ATTACHMENT)
                }
                if (announcement.ATTACHMENT && this.pdfsToDownload[index].indexOf(announcement.ATTACHMENT) > -1) {
                    console.log("checking attachment", announcement.ATTACHMENT, targetPath)
                    const fileToks = announcement.ATTACHMENT.split('/')
                    const fileName = fileToks[fileToks.length - 1]
                    if (fs.existsSync(path.join(targetPath, fileName))) {
                        console.log("Target XML exists. Skip", targetPath)
                    }
                    else {
                        await fetchPDF(announcement.ATTACHMENT, path.join(targetPath, fileName), SMART_PROXY_URL)
                        try {
                            await uploadFileToS3(this.storage_dir, path.join(year, month, day, index, "pdf", fileName))
                        }
                        catch (e) {
                            console.log("Upload to S3 failed")
                            console.error(e)
                        }
                        /*try {
                            await postToGraphQL({
                                query: `mutation StockAnnouncementInsertOne($object: stock_announcements_insert_input!) {
          insert_stock_announcements_one(object: $object) {
            id
          }
        }`,
                                variables: {
                                    "object": {
                                        "announcement_document_link": announcement.ATTACHMENT.trim(),
                                        "announcement_date": `${year}-${month}-${day}`,
                                        "announcement_text_summary": "",
                                        "announcement_sentiment": -1,
                                        "announcement_impact": "",
                                        "stock": {
                                            "data": {
                                                "symbol": announcement.SYMBOL,
                                                "company_name": announcement["COMPANY NAME"],
                                                "segment": index.toLowerCase() === "sme" ? 1 : 0
                                            },
                                            "on_conflict": {
                                                "constraint": "stock_symbol_key",
                                                "update_columns": ["symbol", "company_name"]
                                            }
                                        }
                                    }
                                }
                            })
                        }
                        catch (e) {
                            console.log("Error Posting GQL", announcement)
                            console.error(e)
                        }*/
                        try {
                            fs.appendFileSync(path.join(this.storage_dir, year, month, day, index, "activity.log"), JSON.stringify(announcement) + ",\n")
                        }
                        catch (e) {
                            console.error(e)
                        }
                    }

                }
            }
        }
    }
}
module.exports = InsiderScraper