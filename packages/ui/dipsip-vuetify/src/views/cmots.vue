<template>
<div>
    <v-select v-model="reportSelected" :items="reports"
    item-title="title"
    item-value="url" return-object>
    </v-select>
    <v-btn @click="fetch">Fetch</v-btn>
</div>
</template>
<script>
const authHeader = import.meta.env.VITE_cmots_token
console.log(authHeader)
export default{
    data(){
        return{
            reportSelected: {
                "title": "Quarterly Results",
                "url": "http://jwttoken.cmots.com/Aidea/api/QuarterlyResults/476/C"
            },
            reports: [
            {
                "title": "Quarterly Results",
                "url": "http://jwttoken.cmots.com/Aidea/api/QuarterlyResults/476/C"
            },
            {
                "title": "Shareholding Detailed",
                "url": "http://jwttoken.cmots.com/Aidea/api/ShareholdingMorethanonePerDetails/476"
            }
        ]
        }
        
    },
    methods:{
        async fetch(){
        console.log("fetch")
        const response = await fetch(this.reportSelected.url, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authHeader}`
            }
        })
        //console.log(response)
        const json = await response.json()
        console.log(this.reportSelected.title, json)
    },
    }
    
    
}
</script>
