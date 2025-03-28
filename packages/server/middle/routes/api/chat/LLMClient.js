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
const analysis = function(pre_populated_arrays) {
    // Reasoning Steps:
    // 1. Create a map to track companies and their indices
    // 2. Iterate through all indices
    // 3. For each index, track companies
    // 4. Find companies appearing in multiple indices
    
    let companyIndexMap = new Map();

    // Iterate through all indices
    console.log(pre_populated_arrays.index_wise_companies)
    pre_populated_arrays.index_wise_companies.forEach(indexData => {
        let indexName = indexData.index_name;
        
        // For each company in this index
        indexData.companies_in_index.forEach(company => {
            if (!companyIndexMap.has(company.company_name)) {
                companyIndexMap.set(company.company_name, new Set());
            }
            
            // Add this index to company's indices
            companyIndexMap.get(company.company_name).add(indexName);
        });
    });

    // Filter companies in multiple indices
    let multiIndexCompanies = [];
    
    for (let [companyName, indices] of companyIndexMap.entries()) {
        if (indices.size > 1) {
            // Find the first company object to get additional details
            let companyDetails = pre_populated_arrays.index_wise_companies
                .flatMap(index => index.companies_in_index)
                .find(c => c.company_name === companyName);

            multiIndexCompanies.push({
                company_name: companyName,
                company_nse_symbol: companyDetails.company_nse_symbol,
                company_sector: companyDetails.company_sector,
                indices: Array.from(indices),
                number_of_indices: indices.size
            });
        }
    }

    // Sort by number of indices in descending order
    multiIndexCompanies.sort((a, b) => b.number_of_indices - a.number_of_indices);

    return multiIndexCompanies;
}
module.exports = analysis`
                break;

            case 'FormatMockLLM':
                llmResponse = 'For the corporate announcement by <a href="http://localhost/company/ACC">ACC Ltd</a> dated March 21, 2025, you can access the official document at: https://nsearchives.nseindia.com/corporate/RAVIDAMLE_28032025164527_KCL_intimationof_tradingwindowclosure.pdf'
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