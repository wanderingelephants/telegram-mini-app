const { DateTime } = require('luxon');
const path = require('path');
const fs = require('fs');
const NSEScraper = require("./NSEScraper");
const { uploadFileToS3 } = require('../../../utils/s3Upload');

class FiftyTwoWeekHighLowScraper extends NSEScraper{
    constructor(typeOfDisclosure, isMaster, filesToDownload){
        super(typeOfDisclosure, isMaster, filesToDownload)
    }
    async processTableData(tableData, keys){
        const now = DateTime.now().setZone('Asia/Kolkata');
              const date = now.toFormat('yyyy-MM-dd');
              const [year, month, day] = date.split('-');
              
        let documentLinksDownloaded = {}
        if (!tableData) {
            return documentLinksDownloaded
        }
        keys.forEach(k => documentLinksDownloaded[k] = [])
        for (const index of keys) {
            for (const announcement of tableData[index]) {
                const targetPath = path.join(this.storage_dir, year, month, day, index)
                console.log("targetPath", targetPath)
                fs.mkdirSync(targetPath, { recursive: true })
                console.log(announcement)
                fs.appendFileSync(path.join(targetPath, "data.json"), JSON.stringify(announcement))
            }
        }
        return documentLinksDownloaded
    }
}
module.exports = FiftyTwoWeekHighLowScraper