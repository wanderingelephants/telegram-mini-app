<template>
    <div>
        <v-textarea
            v-model="promptTemplate"
            label="Enter your prompt"
            rows="1"
        ></v-textarea>
        <v-textarea
            v-model="query"
            label="Enter your query"
            rows="10"
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
            v-model="ollamaModel"
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
                const resp = await api.post("/api/chat/reasoning", {
                    distilledModel: "announcements_summary",
                    llm: "Ollama",
                    "singleShotPrompt": true,
                    streaming: false,
                    messages: [{"role": "user", "content": this.query}],
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
            model: 'mf_reasoning',
            promptResponse: '',
            query: 'which stock is present in only small cap funds',
            ollamaModel: 'llama3.2:latest',
            models: ['deepseek-coder-v2', 'llama3.2:latest', 'gemma:7b', 'tinyllama:latest', 'phi3:mini', 'mistral:latest', 'phi4:latest', 'deepseek-r1', 'incept5/llama3.1-claude'],
            timeTaken: 0,
            operation: 'testPrompt',
            operations: ['savePrompt', 'testPrompt'],
            promptTemplate: ``,
        }
    }
}
</script>
