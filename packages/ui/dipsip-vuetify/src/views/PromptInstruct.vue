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
            models: ['llama3.2:latest', 'gemma:7b', 'tinyllama:latest', 'phi3:mini', 'mistral:latest', 'phi4:latest'],
            timeTaken: 0,
            operation: 'savePrompt',
            operations: ['savePrompt', 'testPrompt'],
            promptTemplate: `In the context of Indian Financial Markets, 
Given the following user profile and risk assessment:
Demographics:
- Age Group: Above 65 years
- Employment: Other/Not Currently Employed
- Income Stability: Highly variable/uncertain
Financial Health:
- Monthly Savings: Less than 10%
- Emergency Fund: 1-3 months of expenses
- Debt Obligations: More than 50%
Based on this profile, please provide:
1. Specific mutual fund recommendations (including debt, equity, and hybrid funds) with allocation percentages
2. Emergency fund recommendations considering the user's current situation
3. Insurance recommendations (life, health, and other relevant insurance products)
4. Any other financial planning advice specific to this user's profile
Please provide detailed explanations for each recommendation, considering the user's risk profile, age, employment stability, and current financial health.`,
        }
    }
}
</script>
