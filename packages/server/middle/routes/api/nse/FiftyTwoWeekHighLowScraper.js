const { DateTime } = require('luxon');
const path = require('path');
const fs = require('fs');
const { postToGraphQL } = require("../../../lib/helper")

const NSEScraper = require("./NSEScraper");
const { uploadFileToS3 } = require('../../../utils/s3Upload');

class FiftyTwoWeekHighLowScraper extends NSEScraper {
    constructor(typeOfDisclosure, isMaster, filesToDownload) {
        super(typeOfDisclosure, isMaster, filesToDownload)
    }
    //{"SYMBOL":"3IINFOLTD","SERIES":"EQ","LTP":"23.94","CHANGE_PERCENT":"-2.64","NEW_52W_LOW":"23.54","PREV_LOW":"24.30","PREV_LOW_DATE":"18-Feb-2025"}
    async updateGQL(announcement, index, year, month, day){
        const query = `mutation insert_fifty_two_week_high_low($object: fifty_two_week_high_low_insert_input!){
            insert_fifty_two_week_high_low_one(object: $object){
                id
            }
        }`
        const variables = {
            "object": {
              "stock": {
                "data": {
                  "symbol": announcement.SYMBOL,
                  "company_name": announcement.SYMBOL
                },
                "on_conflict": {
                  "constraint": "stock_symbol_key",
                  "update_columns": ["symbol"]
                }
              },
              "ltp": announcement.LTP,
              "change_percent": announcement.CHANGE_PERCENT,
              "new_high_low": index === "fifty_two_weeks_high" ? announcement.NEW_52W_HIGH : announcement.NEW_52W_LOW,
              "prev_high_low": "fifty_two_weeks_high" ? announcement.PREV_HIGH : announcement.PREV_LOW,
              "prev_high_low_date": index === "fifty_two_weeks_high" ? announcement.PREV_HIGH_DATE : announcement.PREV_LOW_DATE,
              "is_high": index === "fifty_two_weeks_high" ? true:false,
              "reporting_date": `${year}-${month}-${day}`
            }
          }
        await postToGraphQL({
            query, 
            variables
        })

    }
    async processTableData(tableData, keys) {

        if (!tableData) {
            return ""
        }
        console.log("tableData", tableData)
        for (const index of keys) {
            if (tableData[index].length == 0) continue;
            const [year, month, day] =  this.extractDateComponents(tableData[index][0]["AS_ON_DATE_TIME"])
            const targetPath = path.join(this.storage_dir, year, month, day, index)
            console.log("targetPath", targetPath)
            fs.mkdirSync(targetPath, { recursive: true })
            const dataFilePath = path.join(targetPath, "data.json")
            if (fs.existsSync(dataFilePath)) {
                console.log("skip, because data.json exists at ", dataFilePath)
                continue
            }
            for (const announcement of tableData[index]) {
                console.log(announcement)
                fs.appendFileSync(dataFilePath, JSON.stringify(announcement))
                /*try {
                    await uploadFileToS3("fifty_two_week_high_low", this.storage_dir, path.join(year, month, day, index, fileName))
                }
                catch (e) {
                    console.log("Upload to S3 failed")
                    console.error(e)
                }*/
                await this.updateGQL(announcement, index, year, month, day)
            }
        }
        return ""
    }
}
module.exports = FiftyTwoWeekHighLowScraper