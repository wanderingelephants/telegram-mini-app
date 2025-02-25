const axios = require("axios")
const { Anthropic } = require('@anthropic-ai/sdk');

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
                        system: systemPrompt,
                        messages: llmStructuredMessages,
                        temperature: this.temperature
                    });
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
                llmResponse = `const analysis = function(mutual_funds, mutual_fund_stock_holdings, holding_reporting_dates, insider_trades, corporate_announcements, daily_closing_stock_prices_by_company_name, market_nse_nifty_closing_prices, user_stock_portfolio){
                        return [
                        {
                            "mutual_fund_name" : "Motilal Oswal Small Cap"
                        }
                        ]
                    }`
                break;

            case 'FormatMockLLM':
                llmResponse = `The best fund as per database is Motilal Oswal Small Cap`
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