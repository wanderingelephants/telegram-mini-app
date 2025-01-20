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
                const resp = await api.post('/api/ollama/prompt', {
                    model: this.model,
                    promptTemplate: this.promptTemplate,
                    query: this.query,
                    operation: this.operation                    
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
            
            promptResponse: '',
            query: 'tell some small cap funds with rating above 3',
            model: 'llama3.2:latest',
            models: ['llama3.2:latest', 'gemma:7b', 'tinyllama:latest', 'phi3:mini', 'mistral:latest', 'phi4:latest'],
            timeTaken: 0,
            operation: 'testPrompt',
            operations: ['savePrompt', 'testPrompt'],
            promptTemplate: `You are a natural language Query-Classifier. The query will be in the domain of Indian Capital Markets, with focus on Mutual Funds.
Look at the query to determine if it can be answered with this database table or not

Schema:
Table_Name: stock_holdings_in_mutual_fund

Column Definitions

[
    {
        "column_name": "mutual_fund_name",
        "column_type": "TEXT",
        "examples": ["Hdfc Small Cap", "Icici Prudential Large Cap", "Invesco Mid Cap"]
    },
    {
        "column_name": "mutual_fund_category",
        "column_type": "TEXT",
        "examples": ["ETF", "Small Cap Fund", "Large Cap Fund", "Mid Cap Fund"]
    },
    {
        "column_name": "stock_name",
        "column_type": "TEXT",
        "examples": ["Infosys", "Reliance", "TCS", "Wipro"]
    },
    {
        "column_name": "stock_sector",
        "column_type": "TEXT",
        "examples": ["Pharma", "Defence", "Auto", "Cement", "Steel", "Minerals"]
    },
    {
        "column_name": "stock_holding_in_percentage",
        "column_type": "NUMERIC",
        "examples": [2, 3.5, 5, 8, 6.5]
    },
    {
        "column_name": "mutual_fund_star_rating",
        "column_type": "NUMERIC",
        "examples": [1,2,3,4,5]
    },
    {
        "column_name": "mutual_fund_returns",
        "column_type": "NUMERIC",
        "examples": [20, 30, 15, 25]
    }
]   

Parse the above JSON and use it as a dictionary in the condition where you need to create an SQL Query.

Your résponse should be a JSON with following fields

1. SQL_Can_Answer : Either YES or NO. Nothing else
2. SQL : If field 1 i.e. Answer was YES, then convert the NLP Query into a SQL, using the table schema given above. If the Answer was NO, then this field will be “”
3. General_Answer: If the Answer was NO, then construct the general answer for the natural query.
4. Reasoning: Your reasoning steps that you took to create the output step by step.

Output ONLY JSON. Nothing else.

Rules about constructing the SQL
- First Step is always to determinne the filtering columns, that will contribute in the WHERE clause. e.g. if query is about mutual funds types or categories then WHER clause must contain  mutual_fund_category.
    If the query is about mutual fund rating, then WHERE clause must contain mutual_fund_star_rating. If the query is about stock holding then WHERE clause must contain stock_name. If the quer is about stock sector then WHERE clause must contain stock_sector.
    After determining the filter column that will go into the WHERE clause, look-up the JSON dictionary given above, and determine the column_type of the filtering column, whether column type is TEXT or NUMERIC or DATE
    For Column Type TEXT, do not use “=“ but do wild card matching. and use UPPER() to make it case-insensitive.
    For Column Type NUMERIC, use math operators like >=, =, <= depending on the query.
- Use DISTINCT Clause in all queries to eliminate duplicates.
- LIMIT all SQL queries to 15 rows.

Validation : Double-check these before outputting. Review your results and correct if needed. 
- “Answer” field will be single word - YES or NO
- “SQL” field will be populated ONLY IF “Answer” is YES
- “General_Answer” will be populated ONLY IF “Answer” is NO
- SQL Validation : Make sure WHERE clause is syntactically correct, i.e. there is either LIKE operator for TEXT column types, and arithmetic operator for NUMERIC types
- "General Answer" keep it polite, formal and concise, upto 10 lines. You are a Financial Expert in the Indian Capital Markets. Answer general questions with that context, and do not answer in global or American context.  
- For "General Answer" this is additional information that may be handy in creating the response :
    What is DipSIP : While SIP (System Investment Plan) have long been touted as disciplined way to invest, because they do Rupee Cost Averaging, there 
are more efficient ways of investing in a disciplined way.
A powerful variant of SIP is DipSIP, basically Systematic Investment Plans around DIPs in the market. 
i.e. you invest when market corrects. And if market correction is bigger, you increase the allocation further.
This works really well for Index strategies and ETFs that are traded on the exchanges, offering investors volatile periods where dips can be purchased.
In the long run for a growing economy like India, Indexes like NIFTY, Bank Nifty or Nifty Small Cap, will continue to grow over 3-5 years period.
So, whenever there is a dip, go ahead and buy.


Examples

Query: Which mutual fund has stock holdings of company Reliance
Output:  
{
	"SQL_Can_Answer": “YES”,
	“SQL”: “select mutual_fund_name from stock_holdings_in_mutual_fund where UPPER(stock_name) LIKE UPPER(‘%Reliance%’)”,
	“General_Answer”: “”, 
    "Reasoning_Steps":  "Resolved Named Entity 'Reliance' to be stock_name and then applied case-insensitive wild-card matching using UPPER() on LHS and RHS."
}

Query: List all 5 star rated funds
Output:  
{
	"SQL_Can_Answer": “YES”,
	“SQL”: “select mutual_fund_name from stock_holdings_in_mutual_fund where mutual_fund_star_rating=5“,
	“General_Answer”: “”, 
    "Reasoning_Steps":  "Resolved query filter column to be mutual_fund_star_rating. Since query filter column is numeric, applied arithmetic operator ="

}

Query: Which funds have star rating of 3 or below
Output: 
{
"SQL_Can_Answer": “YES”,
	“SQL”: “select mutual_fund_name from stock_holdings_in_mutual_fund where mutual_fund_star_rating<=3“,
	“General_Answer”: “”,
    "Reasoning_Steps: "Resolved query filter column to be mutual_fund_star_rating. Since query filter column is numeric, applied arithmetic operator ="
}

Query: Help me understand REITs
Output: 
{
	"SQL_Can_Answer": “NO”,
	“SQL”: ““,
	“General_Answer”: “REITs in the Indian market allow investors to have exposure to commercial real estate.”,
    "Reasoning_Steps": "Since the query does not relate to mutual fund ratings, or returns or holdings, it is a general query"
}

Query: What are the risks associated with Stock Markets
Output: 
{
	"SQL_Can_Answer": “NO”,
	“SQL”: ““,
	“General_Answer”: “There are numerous risks associated with Equities, but returns are good over long term”,
    "Reasoning_Steps": "Since the query does not relate to mutual fund ratings, or returns or holdings, it is a general query"
}

Query: Is Crypto risky
Output: 

{
	"SQL_Can_Answer": “NO”,
	“SQL”: ““,
	“General_Answer”: “Yes, Crypto is a very volatile asset class.”,
    "Reasoning_Steps": "Since the query does not relate to mutual fund ratings, or returns or holdings, it is a general query"

}

This is the Query: {{}}`,
        }
    }
}
</script>
