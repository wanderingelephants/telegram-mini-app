<template>
<v-row>
    <v-col cols="3">
          <v-select
            max-width="150px"
            label="url"
            theme="light"
            v-model="postUrl"
            :items="[
                '/api/db/create'
            ]"
            variant="underlined"
          ></v-select>
        </v-col>
        <v-btn @click="postToApi">Submit</v-btn>
    </v-row>
    
</template>
<script>
import api from './api.js'

export  default {
    data(){
        return{
            postUrl: "",
            dataToPost: {},
        }
    },
    methods: {
        async postToApi(){
            await api.post(this.postUrl, this.dataToPost)
        },
    }
}
</script>
