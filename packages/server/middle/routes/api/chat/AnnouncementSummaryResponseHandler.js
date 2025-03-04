const { postToGraphQL } = require("../../../lib/helper")

class AnnouncementSummaryResponseHandler {
    constructor(customData) {
      this.customData = customData
    }
    transformKeys(obj) {
        const newObj = {};
        for (const key in obj) {
          const newKey = key.replace(/-/g, "_"); // Replace all '-' with '_'
          newObj[newKey] = obj[key];
        }
        return newObj;
    }
    stripJSTicks(functionText, stringToStrip) {
      const idx = functionText.indexOf(stringToStrip)
      if (idx > -1) functionText = functionText.substring(idx + stringToStrip.length)
      const lastIdx = functionText.lastIndexOf(stringToStrip)
      if (lastIdx > -1)
          return functionText.substring(0, lastIdx)
      else return functionText
  }
    async handleResponse(llmResponse) {
        let jsonResp = llmResponse
        jsonResp = jsonResp.replace(/\\+/g, '')
        jsonResp = jsonResp.replace(/\\/g, '\\\\');
        jsonResp = this.stripJSTicks(jsonResp, "```")
        console.log("after js ticks removal", jsonResp)
        let jsonObj;
        try {
            jsonObj = JSON.parse(jsonResp);
        } catch (e) {
            console.error(e)
            jsonObj = {};
            let firstIdx = jsonResp.indexOf("{")
            if (firstIdx == -1) {
                let idxOfSummary = jsonResp.indexOf("\"Announcement_Summary\"")
                jsonResp = jsonResp.substring(idxOfSummary, jsonResp.length)
                jsonResp = "{" + jsonResp
            }
            let lastIdx = jsonResp.lastIndexOf("}")
            if (lastIdx == -1) jsonResp += "}"
            jsonResp = jsonResp.replace(/\\u[\dA-Fa-f]{4}/g, '');

            jsonObj = JSON.parse(jsonResp)

        }

        jsonObj = this.transformKeys(jsonObj)
        let sentiment = -1
        if (jsonObj.Announcement_Sentiment) {
            switch (jsonObj.Announcement_Sentiment.toLowerCase()) {
                case "positive": sentiment = 0; break;
                case "negative": sentiment = 1; break;
                case "neutral": sentiment = 2; break;
            }
        }
        console.log("summary handler", jsonObj)
        if (jsonObj.isMock === true){
          console.log("Mock Unit Test Done", jsonObj)
          return;
        }
        try {

            const summaryMutation = `mutation StockAnnouncementUpdate(
  $attachment: String!, 
  $textSummary: String, 
  $impact: String, 
  $sentiment: Int
) {
  update_stock_announcements(
    where: {announcement_document_link: {_like: $attachment}}, 
    _set: {
      announcement_text_summary: $textSummary, 
      announcement_impact: $impact, 
      announcement_sentiment: $sentiment
    }
  ) {
    returning {
      id
    }
  }
}
`
            const summaryObj = {
                "attachment": this.customData.attachment.trim() + "%",
                "textSummary": jsonObj.Announcement_Summary,
                "impact": jsonObj.Announcement_Impact_On_Business_Or_StockPrice,
                "sentiment": sentiment
            }
            const resp = await postToGraphQL({ "query": summaryMutation, "variables": summaryObj })
            console.log("Updated Summary Announcement", resp, jsonObj)
        }
        catch (e) {
            console.error(e)
        }
        return jsonObj
    }
}
module.exports = AnnouncementSummaryResponseHandler