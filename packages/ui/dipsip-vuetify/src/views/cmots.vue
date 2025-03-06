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
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFpZGVhIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzQxMTYzNjA3LCJleHAiOjE3NDI0NTk2MDcsImlhdCI6MTc0MTE2MzYwNywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDE5MSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAxOTEifQ.BcOEW6MX2D-lDBPaOOAqLcvrTz3kLW8G08bAZaqEoA0"
            }
        })
        //console.log(response)
        const json = await response.json()
        console.log(this.reportSelected.title, json)
    },
    }
    
    
}
</script>
