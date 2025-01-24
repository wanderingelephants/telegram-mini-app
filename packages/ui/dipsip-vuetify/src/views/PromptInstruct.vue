<template>
    <div>
        <v-textarea
            v-model="promptTemplate"
            label="Enter your prompt"
            rows="20"
        ></v-textarea>
        <v-textarea
            v-model="query"
            label="Enter your query"
            rows="1"
        ></v-textarea>
        <v-card-title>Time Taken: {{timeTaken}}</v-card-title>
        <v-textarea
            v-model="promptResponse"
            label="Response"
            rows="4"
        ></v-textarea>
        <v-text-field label="Prompt Name" v-model="promptName">
        </v-text-field>
        
        <v-select
            v-model="operation"
            :items="operations"
            label="Select Operation"
            class="mb-4"
        ></v-select>
        <v-select
            v-model="model"
            :items="models"
            label="Select Model"
            class="mb-4"
        ></v-select>
        <v-btn @click="sendPrompt">SEND</v-btn>
    </div>
</template>

<script>
import api from "./api";

export default{
    methods: {
        async sendPrompt(){
            console.log('sending', this.model, this.prompt)
            try{
                const startTime = new Date()
                const resp = await api.post('/api/ollama/promptInstruct', {
                    model: this.model,
                    promptTemplate: this.promptTemplate,
                    query: this.query,
                    operation: this.operation,
                    promptName: this.promptName                    
                })
                const endTime = new Date()
                this.timeTaken = endTime - startTime
                console.log("Time Taken", this.timeTaken)
                this.promptResponse = resp.data
            }
            catch(e){
                console.log(e)
            }
        }
    },
    data(){
        return {
            promptName: 'risk_profile',
            promptResponse: '',
            query: '',
            model: 'llama3.2:latest',
            models: ['llama3.2:latest', 'gemma:7b', 'tinyllama:latest', 'phi3:mini', 'mistral:latest', 'phi4:latest', 'deepseek-v2'],
            timeTaken: 0,
            operation: 'savePrompt',
            operations: ['savePrompt', 'testPrompt'],
            promptTemplate: `You  are an SQL Query Generator in SQLite DB. You have to generate a SQL query to answer a user's Question.
Create a SQL Query using Table : mutual_fund_stock_holdings 
Columns : mutual_fund_name, mutual_fund_category, mutual_fund_star_rating, holding_stock_name, holding_stock_sector,
holding_reporting_date, holding_stock_percentage, mutual_fund_returns_3_Years, mutual_fund_returns_1_Years, mutual_fund_returns_5_Years,
mutual_fund_returns_10_Years

Rules to construct SQL
When matching Named Entities like holding_stock_name or mutual_fund_category, do  not use  "=" operator, but use LIKE with wild-cards
When matching Named Entities like holding_stock_name or mutual_fund_category, use UPPER() on both sides to  make it case-insensitive search

Output a JSON, and nothing else.

Output JSON should have only 2 fields - SQL and Reasoning. SQL contains the SQL Query you generated, and "Reasoning" will have the reasons and steps you took.
Do not output anything other than JSON.

Examples

Question: Which mutual funds have star rating above 3
Output: 
{
    "SQL": "Select mutual_fund_name, mutual_fund_category from mutual_fund_stock_holdings where mutual_fund_category > 3",
    "Reasoning": "Identified filter column for WHERE clause to be mutual_fund_category. Since it is numerical, used operator >"
}

Question: Which mutual funds have stock holdings of company 'V2 Retail'
Output: 
{
    "SQL": "Select mutual_fund_name, holding_stock_percentage from mutual_fund_stock_holdings where  UPPER(holding_stock_name) LIKE UPPER('%V2 Retail%')",
    "Reasoning": "Identified filter column for WHERE clause to be holding_stock_name. Since it is named entity, used UPPER and LIKE operators"
}

Here is the Question: {{}}`,
        }
    }
}
</script>
