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
            console.log('sending', this.model)
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
            models: ['deepseek-coder-v2', 'llama3.2:latest', 'gemma:7b', 'tinyllama:latest', 'phi3:mini', 'mistral:latest', 'phi4:latest', 'deepseek-r1', 'incept5/llama3.1-claude'],
            timeTaken: 0,
            operation: 'testPrompt',
            operations: ['savePrompt', 'testPrompt'],
            promptTemplate: `
            You are a javascript programmer who has to write a function code, that processes some mutual fund data from indian markets, to answer the given User Question.
            The input data consists of 3 arrays -  mutual_funds, mutual_fund_stock_holdings, mutual_funds_reporting_dates
The function and its parameters are defined in this JSON:

{
    "function": {
        "name": "analyzeMutualFunds",
        "description" : "process the mutual funds and their stock holdings data to answer the User Question",
        "parameters": [
            {
            "type" : "Array",
            "name" : "mutual_funds",
            "description": "An array representing mutual funds. Each object represents a mutual fund, its attributes and stock holdings",
            "items" : [
                {
                    "name": "mutual_fund_name",
                    "type": "string",
                    "description": "name of the mutual fund",
                    "enum": null
                },
                {
                    "name": "mutual_fund_category",
                    "type": "string",
                    "description": "mutual fund category. must be one of the enums",
                    "enum": ["small cap fund", "mid cap fund", "large cap fund", "multi cap fund"]
                },
                {
                    "name": "mutual_fund_star_rating",
                    "type": "number",
                    "description": "mutual fund star rating. 1 through 5. 5 being best, 1 being worst. Null means unrated",
                    "enum": [1, 2, 3, 4, 5]
                },
                {
                    "name": "mutual_fund_aum",
                    "type": "float",
                    "description": "mutual fund's assets under management expressed in Crores (INR)",
                    "enum": null
                },
                {
                    "name": "mutual_fund_expenses_ratio",
                    "type": "number",
                    "description": "Fee charged by fund, also known as mutual fund fee",
                    "enum": null
                },
                {
                    "name": "mutual_fund_category_expenses_ratio",
                    "type": "number",
                    "description": "Average Fee charged by other funds in same category, also known as average category fees",
                    "enum": null
                }
            ]
            },
                {
                    "name" : "mutual_fund_stock_holdings",
                    "type" : "Array",
                    "items" : [
                        {
                    "name": "mutual_fund_name",
                    "type": "string",
                    "description": "name of the mutual fund",
                    "enum": null
                },
                {
                    "name": "mutual_fund_category",
                    "type": "string",
                    "description": "mutual fund category. must be one of the enums",
                    "enum": ["small cap fund", "mid cap fund", "large cap fund", "multi cap fund"]
                },
                {
                    "name": "mutual_fund_star_rating",
                    "type": "number",
                    "description": "mutual fund star rating. 1 through 5. 5 being best, 1 being worst. Null means unrated",
                    "enum": [1, 2, 3, 4, 5]
                },
                {
                    "name": "mutual_fund_aum",
                    "type": "float",
                    "description": "mutual fund's assets under management expressed in Crores (INR)",
                    "enum": null
                },
                {
                    "name": "mutual_fund_expenses_ratio",
                    "type": "number",
                    "description": "Fee charged by fund, also known as mutual fund fee",
                    "enum": null
                },
                {
                    "name": "mutual_fund_category_expenses_ratio",
                    "type": "number",
                    "description": "Average Fee charged by other funds in same category, also known as average category fees",
                    "enum": null
                },
                        {   
                            "name": "stock_name",
                            "type": "string",
                            "description": "Name of the stock for this holding object",
                            "enum": null
                        },
                        {   
                            "name": "stock_sector",
                            "type": "string",
                            "description": "Industry sector for the stock, e.g. Automoible, Pharma, IT",
                            "enum": null
                        },
                        {
                            "name": "stock_holding_percentage_in_fund",
                            "type": "number",
                            "description": "the stock's holding in mutual fund, expressed as percentage",
                            "enum": null
                        },
                        {
                            "name": "stock_holding_reporting_date",
                            "type": "Date",
                            "description": "date on which this holding data was reported by the fund",
                            "enum": null
                        }
                    ]
                }   
             ,
            {
                "type": "Array",
                "name": "mutual_funds_reporting_dates",
                "description": "An Array of unique stock_holding_reporting_date sorted descending by time. Useful for time based filters logic for analyzing stock holding trends  and to get latest data",
                "items": [
                    {
                        "type": "Date",
                        "description": "The date on which the mutual fund published the holdings and other data",
                        "enum": null 
                        
                    }
                ]
            }
        ]
    }
}

Coding Guidelines

- for any Question, there is no use-case of using both the arrays mutual_funds and mutual_fund_stock_holdings together. Use only one of them as following 2 rules describe.
- If Question is related only to Mutual Fund attributes (e.g. star rating, aum, expenses ratio), then it should be answered using mutual_funds array alone. 
- If Question is related to stock holdings, then it should be answered using mutual_fund_stock_holdings. Stock holding question may refer to some attributes like star rating, which is already available in the mutual_fund_stock_holdings array (Denormalized)
- When filtering on Date fields, do not match with === operator directly on the Date objects, first convert to string using toISOString() and then match using ===
- Avoid chained function calling with map(), filter(), sort(), reduce() etc. Keep it "verbose" multi-line, with intermediate values assigned to variables, so code is simple to read and debug.
- Put your reasoning steps as comments in the code.
- mutual_fund_name, mutual_fund_category, stock_name, stock_sector : these are all Named Entities. Do not use === in filter(). Instead do wild-card case-insensitive matching by using toLowerCase() and indexOf()
- wherever the JSON schema indicates enum (not null), make sure you use one of the enum values only. e.g. if user mentions "small cap funds" then it means "small cap fund" from enum defined in above schema.
- holding_reporting_dates : this array must always be used. If the User Question does not mention any time period, then it is assumed to be the latest reporting date, i.e. holding_reporting_dates[0]
    If the User Question is about mutual fund stock holdings comparison across time, then latest_date will be holding_reporting_dates[0], preceding_reporting_date will be holding_reporting_dates[1] and so on. Broadly, one date per Quarter in the indian markets.
- Variable Names : While iterating over arrays or while using arrow functions, use "mfh" for mutual_fund_stock_holdings    
- Duplicates : If return data is an array, then ensure there are no duplicates. e.g. if there are 3 fields in each object of the array, then use the 3 as key to eliminate duplicates.    

Validation: Make sure the Javascript syntax is correct, and it "compiles". i.e. stuff like opening and closing brackets are matching everywhere. e.g. if you start an array with [, then ensure there is a matching closing ]
If you start some block with {, ensure there is matching }. 


Output function as shown here:

const analyzeMutualFunds = function(mutual_funds, mutual_fund_stock_holdings, mutual_funds_reporting_dates){
    //Fill this up based on user question, as explained above.
}

Example 1 : Simple Question with successive filers
Question: Which small cap funds have rating of 4 or more
Response:

const analyzeMutualFunds = function(mutual_funds, mutual_funds_reporting_dates){
//REASONING STEPS
//This query can be answered using mutual_funds array alone
//Step 1 : Filter for mutual funds with mutual_fund_star_rating equal to 4
    const fourStarRatedMutualFunds = mutual_funds.filter(mf => 
        mf.mutual_fund_star_rating === 4
    );

//return result
    return fourStarRatedMutualFunds;
}

Example 2 : Multi hop question with more reasoning steps
Question : in small cap funds, which stocks got added newly 
Response :

const analyzeMutualFunds = function(mutual_funds, mutual_fund_stock_holdings, mutual_funds_reporting_dates) {
//REASONING STEPS
//Need to analyze stock holdings across 2 time periods - latest and preceding quarter
//Step 1: Get the latest and previous reporting dates
const latest_date = mutual_funds_reporting_dates[0];
const preceding_date = mutual_funds_reporting_dates[1];
//Step 2: Get small cap fund holdings for latest date
const latest_smallcap_holdings = mutual_fund_stock_holdings.filter(mfh => 
    mfh.mutual_fund_category.toLowerCase().indexOf('small cap fund') !== -1 &&
    mfh.stock_holding_reporting_date.toISOString() === latest_date.toISOString()
);

//Step 3: Get small cap fund holdings for preceding date
const preceding_smallcap_holdings = mutual_fund_stock_holdings.filter(mfh => 
    mfh.mutual_fund_category.toLowerCase().indexOf('small cap fund') !== -1 &&
    mfh.stock_holding_reporting_date.toISOString() === preceding_date.toISOString()
);

//Step 4: Find stocks that exist in latest but not in preceding
const latest_stocks = new Set(latest_smallcap_holdings.map(mfh => mfh.stock_name.toLowerCase()));
const preceding_stocks = new Set(preceding_smallcap_holdings.map(mfh => mfh.stock_name.toLowerCase()));

const newly_added_holdings = latest_smallcap_holdings.filter(mfh => 
    !preceding_stocks.has(mfh.stock_name.toLowerCase())
);

//Step 5: Create result objects with relevant fields
const result = newly_added_holdings.map(mfh => ({
    mutual_fund_name: mfh.mutual_fund_name,
    stock_name: mfh.stock_name,
    stock_sector: mfh.stock_sector,
    holding_percentage: mfh.stock_holding_percentage_in_fund
}));

//Step 6: Remove duplicates based on all fields
const unique_results = Array.from(new Set(result.map(JSON.stringify))).map(JSON.parse);

return unique_results;
}

Output only the function code, and absolutely nothing  else.
`,
        }
    }
}
</script>
