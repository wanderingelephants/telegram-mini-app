const path = require('path');
const fs = require('fs');
const NSEScraper = require("./NSEScraper");
const fetchPDF = require("./pdfFetcher");
const { uploadFileToS3 } = require('../../../utils/s3Upload');
const SMART_PROXY_URL = process.env.SMART_PROXY_URL

class InsiderScraper extends NSEScraper{
    constructor(typeOfDisclosure, isMaster, filesToDownload){
        super(typeOfDisclosure, isMaster, filesToDownload)
    }
    async processTableData(tableData, keys){
        let documentLinksDownloaded = {}
        if (!tableData) {
            return documentLinksDownloaded
        }
        keys.forEach(k => documentLinksDownloaded[k] = [])
        for (const index of keys) {
            for (const announcement of tableData[index]) {
                const [year, month, day] = this.extractDateComponents(announcement["PUBLISH DATE/TIME"]);
                const targetPath = path.join(this.storage_dir, year, month, day, index, "xml")
                fs.mkdirSync(targetPath, { recursive: true })
                
                if (announcement.ATTACHMENT && announcement.ATTACHMENT.endsWith(".pdf")) {
                    console.log("Skipping PDF announcement", announcement.ATTACHMENT)
                    continue;
                }
                if (announcement.ATTACHMENT && this.filesToDownload[index].findIndex(item => item.ATTACHMENT === announcement.ATTACHMENT) > -1) {
                    console.log("checking pdf", announcement.ATTACHMENT, targetPath)
                    const fileToks = announcement.ATTACHMENT.split('/')
                    const fileName = fileToks[fileToks.length - 1]
                    if (fs.existsSync(path.join(targetPath, fileName))) {
                        console.log("Target XML exists. Skip", targetPath, fileName)
                    }
                    else {
                        await fetchPDF(announcement.ATTACHMENT, path.join(targetPath, fileName), SMART_PROXY_URL)
                        try {
                            await uploadFileToS3(this.storage_dir, path.join(year, month, day, index, "xml", fileName))
                        }
                        catch (e) {
                            console.log("Upload to S3 failed")
                            console.error(e)
                        }
                        await this.updateGQL(announcement, index, year, month, day)
                        await this.updateActivityLog(announcement, index, year, month, day)
                        documentLinksDownloaded[index].push(announcement.ATTACHMENT)
                    }

                }
            }
        }
        return documentLinksDownloaded
    }
}
module.exports = InsiderScraper