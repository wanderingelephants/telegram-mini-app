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
                    ollamaModel: this.model,
                    base_prompt: this.promptTemplate,
                    userQuestion: this.query,
                    operation: this.operation,
                    promptName: this.promptName                    
                })
                const endTime = new Date()
                this.timeTaken = endTime - startTime
                console.log("Time Taken", this.timeTaken)
                this.promptResponse = JSON.stringify(resp.data)
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
            query: 'which stock is present in only small cap funds',
            model: 'llama3.2:latest',
            models: ['llama3.2:latest', 'gemma:7b', 'tinyllama:latest', 'phi3:mini', 'mistral:latest', 'phi4:latest', 'deepseek-v2', 'incept5/llama3.1-claude'],
            timeTaken: 0,
            operation: 'testPrompt',
            operations: ['savePrompt', 'testPrompt'],
            promptTemplate: `You are a javascript programmer who anayzes mutual funds holdings data. I will give you a question about mutual fund holdings analysis. 
Your task is to output a JavaScript function named 'analyze' that takes argument named mutual_funds_holdings, which is an array of mutual fund holdings data
Output only the function string and nothing else. 

The input array format is:
[{
  "mutual_fund_name": string,
  "mutual_fund_category": string,
  "stock_name": string,
  "stock_holding_in_percentage": string,
  "holding_reporting_date": string (YYYY-MM-DD) e.g. 2024-12-31
}]

Some fields have only a fixed set of values. e.g. mutual_fund_category can only be one of ["Small Cap Fund", "Large Cap Fund", "Mid Cap Fund"]

Each record in the array represents a stock's percentage holding in the mutual fund, on the given holding_reporting_date. 
Remember, when using filter on stock_name or mutual_fund_name, then do not do exact match (===), do a case-insensitive filter by doing toLowerCase and using indexOf
e.g. to filter holdings for stock_name Fictitious, mutual_fund_holdings_array.filter(holding => holding.stock_name.toLowerCase().indexOf('Fictitious'.toLowerCase() > -1))
If the Question is about comparing holdngs between 2 periods like current and previous then use the holding_reporting_date field. 
e.g. latest holding will be the record with maximum holding_reporting_date. 
e.g. previous holding will be the record with date immediately preceding holding_reporting_date. so, if one were to sort the  array om date DESCENDING, then latest holding date will be
the first record, previous holding date will be second record and earliest holding date will be the last record.

Coding Guideline : Avoid nested functions e.g. set.map().sort().filter(). Instead follow a "verbose" approach, where each operation like filter, sort, map, reduce is done in a separate line with separate variables. 
This reduces the likelihood of syntax errors in your code. Syntax validation and checking is easier with simple to follow code.

Validation: Make sure the Javascript syntax is correct, and it "compiles". i.e. stuff like opening and closing brackets are matching everywhere. e.g. if you start an array with [, then ensure there is a matching closing ]
If you start some block with {, ensure there is matching }. 
Try to execute the function with an empty array, so that compilation and syntax errors you can find yourself, before sending back the output.

If the output array length is more than 20, slice and return the first 20 objects.
`,
        }
    }
}
</script>
