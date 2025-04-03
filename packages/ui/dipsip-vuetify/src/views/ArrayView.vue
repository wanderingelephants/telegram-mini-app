<template>
    <div>
        <google-sign-in />
        <v-card
            v-for="arr in Object.keys(precomputedarrays)"
            :key="arr"
          >
          <v-row v-for="field in precomputedarrays[arr]" :key="field">
          <v-card-text>{{field}}</v-card-text>
          </v-row>
          </v-card>
        <v-card>
            <v-btn @click="getData">Fetch</v-btn>
        </v-card>
    </div>
</template>
<script>
import { mapState } from "vuex";
import GoogleSignIn from "../components/GoogleSignIn";

export default{
    computed: {
    ...mapState(["loggedInGoogle", "userGoogle"])
  },
  components:{
    GoogleSignIn
  },
  data(){
    return {
        precomputedarrays: []
    }
  },
    methods:{
        async getData(){
            this.precomputedarrays = []
            const resp = await fetch("/api/chat/arrayview", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwtGoogle")}`,
                },
            })
            console.log(resp)
            this.precomputedarrays = await resp.json()
            console.log(Object.keys(this.precomputedarrays))
        }
    }
}
</script>