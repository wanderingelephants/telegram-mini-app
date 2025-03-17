const axios = require("axios")
const { Anthropic } = require('@anthropic-ai/sdk');
const fs = require("fs");
const path = require("path")
//Sends a chat request and sends back response. For Instruct also use chat model with  
//sytem prompt and single message
class LLMClient {
    constructor(llmToUse, langModel) {
        console.log("LLMClient constructor", { llmToUse, langModel })
        this.llmToUse = llmToUse
        this.langModel = langModel //'claude-3-5-haiku-20241022'
        this.temperature = 0
    }
    async sendMessageToLLM(systemPrompt, messages) {
        const llmStructuredMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content[0].text // dynamically wrapping in a string
        }));

        let llmResponse = "";
        switch (this.llmToUse) {
            case 'Claude':
                try {
                    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
                    const resp = await anthropic.messages.create({
                        model: this.langModel,
                        max_tokens: 1024,
                        system: [{
                            "type":"text",
                            "text": systemPrompt,
                            "cache_control": {"type": "ephemeral"}
                        }
                            
                        ],
                        messages: llmStructuredMessages,
                        temperature: this.temperature
                    });
                    console.log("LLM Full Response", resp)
                    llmResponse = resp.content[0].text.trim();
                }
                catch (e) {
                    console.error(e)
                }
                break

            case 'Ollama':
                try {
                    const finalPrompt = systemPrompt.replace("{{text_replace}}", messages[0].content)
                    const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
                        model: this.langModel,
                        prompt: finalPrompt,
                        stream: false,
                        temperature: this.temperature
                    });
                    llmResponse = response.data.response.trim()
                }
                catch (e) {
                    console.error(e)
                }
                break;

            case 'JavascriptMockLLM':
                //const filePath = path.join(process.env.DATA_ROOT_FOLDER, "generated_functions/2025/03/07/8de3ffe0-b388-4491-a302-7f6f0aa60ded/stock_market_chat", "analysis_1741321347634.js")
                //const fileContent = fs.readFileSync(filePath, "utf-8")
                llmResponse = `const analysis = async function(mutual_funds, mutual_funds_stock_holdings, holding_reporting_dates, insider_trades, daily_stock_prices_by_company_name, market_nse_nifty_closing_prices, user_stock_portfolio, fifty_two_week_highs, fifty_two_week_lows, company_master_data, company_trailing_twelve_months_ratios){
    // Filter company master data for midcap companies in cement sector
    console.log("company master", company_master_data)
    let midcapCementCompanies = company_master_data.filter(company => 
        company.company_sector_name.toLowerCase().indexOf('cement') !== -1 &&
        company.company_market_cap_label.toLowerCase() === 'mid cap'
    );

    // If no specific sorting is mentioned, sort by market cap value descending
    let sortedMidcapCementCompanies = midcapCementCompanies.sort((a, b) => 
        b.comapny_market_cap_value - a.comapny_market_cap_value
    );

    return sortedMidcapCementCompanies;
}
`
                break;

            case 'FormatMockLLM':
                llmResponse = `The best fund as per database is Motilal Oswal Small Cap\nThis has rating above 4\nFee below 0.5%`
                break;

            case 'SummaryMockLLM':
                llmResponse = `{
                "Announcement_Summary" : "This is the mock announcement summary text",
                "Annnouncement_Impact_On_Business": "Mock impact on business",
                "Announcement_Sentiment": "Positive",
                "isMock": true
            }`
                break;
        }

        return llmResponse
    }
}
module.exports = LLMClient