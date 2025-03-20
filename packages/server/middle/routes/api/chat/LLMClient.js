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
                llmResponse = `const {postToGraphQL} = require(process.env.GRAPHQL_MODULE_PATH)
const analysis = async function(pre_populated_arrays){
    //Step 1: Validate input arrays
    if (!pre_populated_arrays.company_cash_flow_ratios || pre_populated_arrays.company_cash_flow_ratios.length === 0) {
        console.error("No cash flow ratio data available");
        return [];
    }

    //Step 2: Robust filtering for positive free cash flow per share with company name
    let companiesWithPositiveFreeCashFlow = pre_populated_arrays.company_cash_flow_ratios.filter(company => {
        // Use multiple checks to ensure data validity
        let freeCashFlowValue = company.FreeCashFlowperShare;
        return freeCashFlowValue !== null && 
               freeCashFlowValue !== undefined && 
               parseFloat(freeCashFlowValue) > 0;
    });

    //Step 3: If no companies found, return empty array with logging
    if (companiesWithPositiveFreeCashFlow.length === 0) {
        console.warn("No companies found with positive free cash flow per share");
        return [];
    }

    //Step 4: Sort companies by free cash flow per share in descending order
    let sortedCompanies = companiesWithPositiveFreeCashFlow.sort((a, b) => 
        parseFloat(b.FreeCashFlowperShare) - parseFloat(a.FreeCashFlowperShare)
    );

    //Step 5: Enrich data with company details from company_master
    let enrichedCompanies = sortedCompanies.map(cashFlowCompany => {
        // Find corresponding company name from company_master
        let companyDetails = pre_populated_arrays.company_master.find(company => 
            company.company_name !== null && company.company_name !== undefined
        );

        return {
            companyName: companyDetails ? companyDetails.company_name : "Unknown",
            freeCashFlowPerShare: parseFloat(cashFlowCompany.FreeCashFlowperShare),
            year: cashFlowCompany.YRC  // Assuming YRC is the year of reporting
        };
    });

    //Step 6: Return top 50 companies or all if less than 50
    return enrichedCompanies.slice(0, 50);
}
module.exports = analysis`
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