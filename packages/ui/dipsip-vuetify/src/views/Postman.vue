<template>
  <v-container fluid theme="light">
    <v-row>
    <v-col cols="3"  v-if="showSubmit == true">
          <v-select
            max-width="150px"
            label="url"
            theme="light"
            v-model="postUrl"
            :items="[
              '/api/nse/receive', '/api/db/import', '/api/db/create'
            ]"
            variant="underlined"
          ></v-select>
        </v-col>
    </v-row>
    <v-textarea v-if="showSubmit == true" v-model="dataToPost" rows="50"></v-textarea>
    <v-btn @click="submit" v-if="showSubmit == true">Submit</v-btn>
  </v-container>
</template>
<script>
import api from "./api";

import { mapState } from "vuex";
import TelegramLogin from "../components/TelegramLogin.vue";
import axios from "axios";
let botName = 'DipSipBot';
if (import.meta.env.MODE == 'development') botName = 'Dev_DipSip_bot'
export default {
  components: {
    TelegramLogin,
  },
  async  mounted(){
    
    console.log('env', import.meta.env)
    this.tg_admin_id=import.meta.env.VITE_TG_ADMIN_ID
    await this.getETFList()
  },
  computed:mapState([
    // map this.count to store.state.count
    "loggedIn",
    "user",
  ]),
  methods: {
    async getETFList(){
      try{
        const resp = await api.get('/api/nse/instruments')
        this.etfList = resp.data;
        console.log(this.etfList)
      }
      catch(e){
        console.log(e)
      }
    },
    async submit() {
      console.log(this.$store.state.user)
      console.log('session', this.loggedIn, this.user)
      function preprocessJSON(jsonString) {
    // Step 1: Enclose keys in double quotes
    let fixedString = jsonString.replace(/([{,]\s*)(\w+)(?=\s*:)/g, '$1"$2"');
    
    // Step 2: Handle multi-line string values
    let insideValue = false;
    let currentValue = '';
    let lastChar = '';
    let result = '';

    for (const char of fixedString) {
        if (char === '"' && lastChar !== '\\') {
            if (insideValue) {
                // Closing the value
                result += `"${currentValue.replace(/\r?\n/g, '\\n')}"`;
                currentValue = '';
                insideValue = false;
            } else {
                // Starting a new value
                insideValue = true;
            }
        } else if (insideValue) {
            currentValue += char; // Collect characters for the value
        } else {
            result += char; // Add non-value characters to the output
        }
        lastChar = char; // Update last character
    }

    return result;
}

      const fixedJson = preprocessJSON(this.dataToPost);

      //console.log(fixedJson);
      const parsed = JSON.parse(fixedJson);
      let filtered = parsed
      if (this.postUrl === '/api/nse/receive'){
        filtered = parsed.data.filter(
        (record) =>
          this.etfList.map((_) => _.symbol).indexOf(record.symbol) > -1
      );
      console.log(filtered);
      }
      
      await  this.postToApi(filtered)
    },
    async postToApi(data) {
      console.log("post,", data);
      try {
        const response = await fetch(this.postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(response);
        // Handle response
      } catch (error) {
        // Handle API error
      }
    },
    async handleTelegramAuth(user) {
      try {
        const response = await axios.get("/api/telegram/auth", {
          params: user,
        });
        const { token } = response.data;
        
        console.log("tg_admin_id", this.tg_admin_id)
        if (user.id == this.tg_admin_id) this.showSubmit = true

        // Store the JWT in localStorage or a secure cookie
        localStorage.setItem("jwt", token);
        // You might want to update your app's state here
        this.$store.commit("setLoggedIn", true);
        this.$store.commit("setUser", user);
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    },
  },
  data() {
    return {
      etfList: [],
      tg_admin_id: '',
      showSubmit: true,
      showTooltip_tg: false,
      dataToPost: "",
      postUrls: ['/api/nse/receive', '/api/db/import'],
      postUrl: "/api/nse/receive",
      /*filteredList: [
        { symbol: "BANKIETF", underlying: "Nifty Bank" },
        {
          symbol: "SMALLCAP",
          underlying: "Mirae Asset Nifty Smallcap 250 Momentum Quality 100 ETF",
        },
        {
          symbol: "MODEFENCE",
          underlying: "Nifty India Defence Total Return Index",
        },
        { symbol: "HNGSNGBEES", underlying: "Hang Seng Index" },
        { symbol: "MAFANG", underlying: "NYSE FANG+ Total Return Index" },
        { symbol: "PHARMABEES", underlying: "Nifty Pharma TRI" },
      ],*/
    };
  },
};
</script>
