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
    async updateGQL(announcement, index, year, month, day, co_code) {
        
        const query = `mutation insert_fifty_two_week_high_low($object: fifty_two_week_high_low_insert_input!){
            insert_company_new_fiftytwo_week_highlow_one(object: $object){
                id
            }
        }`
        const variables = {
            "object": {
                "co_code": co_code,
                "ltp": this.parseNumber(announcement.LTP.replace(/,/g, '')),
                "change_percent": announcement.CHANGE_PERCENT,
                "new_high_low": index === "fifty_two_weeks_high" ? this.parseNumber(announcement.NEW_52W_HIGH.replace(/,/g, '')) : this.parseNumber(announcement.NEW_52W_LOW.replace(/,/g, '')),
                "prev_high_low": index === "fifty_two_weeks_high" ? this.parseNumber(announcement.PREV_HIGH.replace(/,/g, '')) : this.parseNumber(announcement.PREV_LOW.replace(/,/g, '')),
                "prev_high_low_date": index === "fifty_two_weeks_high" ? announcement.PREV_HIGH_DATE : announcement.PREV_LOW_DATE,
                "is_high": index === "fifty_two_weeks_high" ? true : false,
                "record_date": `${year}-${month}-${day}`
            }
        }
        console.log("52 Week High/Low post to GQL", variables)
        try {
            await postToGraphQL({
                query,
                variables
            })
        }
        catch (e) {
            console.error(e)
        }


    }
    async processTableData(tableData, keys) {

        if (!tableData) {
            return ""
        }
        for (const index of keys) {
            if (tableData[index].length == 0) continue;
            const [year, month, day] = this.extractDateComponents(tableData[index][0]["AS_ON_DATE_TIME"])
            const targetPath = path.join(this.storage_dir, year, month, day, index)
            console.log("targetPath", targetPath)
            fs.mkdirSync(targetPath, { recursive: true })
            const dataFilePath = path.join(targetPath, "data.json")
            if (fs.existsSync(dataFilePath)) {
                console.log("skip, because data.json exists at ", dataFilePath)
                continue
            }
            for (const announcement of tableData[index]) {
                let co_code;
        try {
            const co_code_resp = await postToGraphQL({
                query: `query company_master_by_symbol($nsesymbol: String!){
                          company_master(where: {nsesymbol: {_eq: $nsesymbol}}){
                            co_code
                          }
                        }`,
                variables: { "nsesymbol": announcement.SYMBOL.toUpperCase() }
            })
            if (co_code_resp.data.company_master.length > 0) {
                co_code = co_code_resp.data.company_master[0].co_code
            }
            else {
                console.log("co_code not found. Will not process further", announcement)
                continue;
            }
        }
        catch (e) {
            console.log(e)
        }
                fs.appendFileSync(dataFilePath, JSON.stringify(announcement))
                /*try {
                    await uploadFileToS3("fifty_two_week_high_low", this.storage_dir, path.join(year, month, day, index, fileName))
                }
                catch (e) {
                    console.log("Upload to S3 failed")
                    console.error(e)
                }*/
                await this.updateGQL(announcement, index, year, month, day, co_code)
            }
        }
        return ""
    }
}
module.exports = FiftyTwoWeekHighLowScraper