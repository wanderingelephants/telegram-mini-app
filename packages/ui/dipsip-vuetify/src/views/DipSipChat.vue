<template>
  <v-container fluid class="fill-height pa-0">
    <v-responsive>
    <v-row no-gutters class="fill-height">
        
      <v-col
        cols="12"
      >
        <v-card class="fill-height d-flex flex-column ma-2">
          <v-card-title  class="text-wrap">Regret Buying on Highs or Missing the Lows ?</v-card-title>
          <v-card-subtitle
            >Try DipSIP. A proven contra strategy.</v-card-subtitle
          >
          <v-card-text class="d-flex align-center flex-wrap">
            <google-sign-in/>
            <span>Select ETFs below, Invest Rs.</span>
            <v-select
              theme="light"
              @update:menu="frameworkParamsChanged"
              v-model="base_amt"
              :items="[
                '100',
                '1000',
                '2000',
                '5000',
                '10000'
              ]"
              variant="underlined"
              label=""
              class="mx-1 mb-4"
              style="max-width: 80px; min-width: 50px"
              density="compact"
              hide-details
            />
            <span
              >in each, whenever they dip by more than</span>
            <v-select
              theme="light"
              label=""
              max-width="40px"
              @update:menu="frameworkParamsChanged"
              v-model="trigger"
              :items="['1', '2', '3', '4', '5']"
              variant="underlined"
              style="max-width: 50px; min-width: 50px"
              class="mx-1 mb-4"
              density="compact"
              hide-details
            />
            <span> %, any day.</span>
          </v-card-text>
          <v-row no-gutters class="mt-2">
            <v-col cols="12">
              <v-card class="pb-2" color="amber" theme="light" max-width="100%">
                <v-card-title class="d-flex justify-space-between align-center">
                  Select Your Index Funds
                  <a
                    href="#"
                    @click.prevent="selectionCriteriaDialog = true"
                    class="text-right text-decoration-none"
                  >
                    Selection Criteria
                  </a>
                </v-card-title>
                <v-autocomplete
                v-model="selectedFunds"
                :items="fundList"
                item-title="displayName"
                :custom-filter="customFilter"
                item-value="id"
                :label="
                  'Select Mutual Funds ' +
                  (selectedFunds.length
                    ? `(${selectedFunds.length} selected)`
                    : '')
                "
                multiple
                chips
                return-object
                closable-chips
                persistent-hint
                hint="Partial match works while typing e.g. 'Motilal Small'"
                :search="searchText"
                @update:search="handleSearch"
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :text="item.raw.name"
                    variant="elevated"
                  >
                    <v-icon start>$mdiChartLine</v-icon>
                    {{ item.raw.name }}
                  </v-chip>
                </template>
              </v-autocomplete>
                <v-dialog v-model="selectionCriteriaDialog" width="500">
                  <v-card
                    class="pb-2"
                    color="amber"
                    theme="light"
                    max-width="100%"
                  >
                    <v-card-title class="text-h5 grey lighten-2">
                      Selection Criteria
                    </v-card-title>
                    <v-card-action>
                      <v-btn
                        class="v-btn v-theme--light text-primary v-btn--density-default v-btn--size-default v-btn--variant-outlined"
                        block
                        @click="selectionCriteriaDialog = false"
                        >Close</v-btn
                      >
                    </v-card-action>
                    <v-card-text class="mt-4">
                      <ul>
                        <li>
                          One of the core objectives of this Platform is to
                          declutter and filter the investment options for end
                          users.
                        </li>
                        <li>
                          With more than 2500 Mutual Fund schemes alone, it is
                          tough to filter. Cost comes later.
                        </li>
                        <li>
                          We believe Passive Investments offer best risk
                          adjusted returns over long term.
                        </li>
                        <li>
                          Hence, we will present to users de-duplicated ETFs,
                          which are low cost, liquid and there is public data to
                          analyze them.
                        </li>
                        <li>
                          See section <a href="etfList">ETFs</a> for more
                          details
                        </li>
                      </ul>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <v-card-actions>
                  <button v-if="loggedInGoogle == true && userGoogle.tg_id !== ''"
            @click="saveConfig"
            class="v-btn v-theme--light text-primary v-btn--density-default v-btn--size-default v-btn--variant-outlined"
          >
            Save
          </button>
          <button v-if="loggedInGoogle == true && userGoogle.tg_id !== ''"
            @click="deleteConfig"
            class="v-btn v-theme--light text-primary v-btn--density-default v-btn--size-default v-btn--variant-outlined"
          >
            Unsubscribe
          </button>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-1">
        <v-dialog v-model="showSaveConfigDialog" max-width="430px">
        <v-card theme="light" color="secondary" dense>
          <v-card-title class="d-flex justify-space-between align-center">
            Confirm Your Parameters
          </v-card-title>
          <v-row>
            <v-col cols="4">
              <v-card-text>Amount: {{ base_amt }}</v-card-text>
            </v-col>
            <v-col cols="4">
              <v-card-text>Trigger: {{ trigger }}</v-card-text>
            </v-col>
          </v-row>
          <v-card-text
            >ETFs: {{ etfSelected.map((e) => e.title).join(", ") }}</v-card-text
          >
          <v-card-actions> 
            <v-btn block @click="saveConfigApi">Save</v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn block @click="showSaveConfigDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
        v-model="snackbar.show"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
        >{{ snackbar.message }}</v-snackbar
      >
      </v-row>
        </v-card>
      </v-col>
    </v-row>
    </v-responsive>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import api from "./api";
import {
  GET_USER_MF_PORTFOLIO,
  INSERT_USER_MF_PORTFOLIO,
  DELETE_USER_MF_PORTFOLIO,
  INSERT_USER_CONFIG, DELETE_USER_CONFIG
} from "../lib/helper/queries";

export default {
  components: {
  },
  computed: mapState([
    // map this.count to store.state.count
    "loggedInGoogle",
    "userGoogle",
  ]),
  watch: {
    async loggedInGoogle(newVal) {},
    async userGoogle(newVal) {
      if (newVal && newVal.email) {
        if (this.fundList.length === 0) await this.fetchFundList();
        await this.getUserMFPortfolio();
      }
    },
  },
  async mounted() {
    
  },
  data() {
    return {
      userInput: "",
      messages: [],
      isLoading: false,
      selectionCriteriaDialog: false,
      fundList: [],
      selectedFunds: [],
      portfolio: [],
      searchText: "",
      
      etfList: [],
      etfSelected: [],
      base_amt : 100,
      base_amtShort : '100',
      trigger: 1,
      buy_factor: 1,
      snackbar: {
        show: false,
        message: "",
        timeout: 3000,
        color: "orange",
      },
      showSaveConfigDialog: false,
      title: 'Your Financial Assistant',
      subTitles: ['Ask about DipSIP and how it is useful'],
      userInputLabel: "Ask about DipSIP. No Trading tips.",
      debug: false,
      systemPrompt: "dipsip"
    };
  },
  methods: {
    async sendMessage() {},
    async saveConfig() {
      await  this.updatePortfolio()
      await  this.saveConfigKeyVal()
      this.snackbar.message = "Saved"
      this.snackbar.color = "green"
      this.snackbar.show = true
    },
    async deleteConfig(){
      try{
        await this.$apollo.query({
          query: DELETE_USER_CONFIG,
          variables: {
            email: this.userGoogle.email,
            key: "dipsip_etf_config"
          },
          fetchPolicy: "no-cache", 
        })
        this.snackbar.message = "Unsubscribed"
        this.snackbar.color = "green"
        this.snackbar.show = true
        await this.getUserMFPortfolio()
      }
      catch(e){
        console.error(e)
      }
    },
    async saveConfigKeyVal(){
      try{
        await this.$apollo.query({
          query: INSERT_USER_CONFIG, 
          variables:{
            "object":{
              "key": "dipsip_etf_config",
              "value": JSON.stringify({trigger: this.trigger, base_amt: this.base_amt, buy_factor: this.buy_factor}),
              "user": {
                "data": {
                  "email": this.userGoogle.email,
                  "google_id": this.userGoogle.uid
                },
                "on_conflict": {
                  "constraint": "users_email_key",
                  "update_columns": ["email"]
                }
              }
            }
          },
          fetchPolicy: "no-cache",
          
        })
      }
      catch(e){
        console.error(e)
      }
    },
    handleSearch(val) {
      // The search text will be available in 'val'
      this.searchText = val;
    },
    frameworkParamsChanged(){
        /*this.base_amt = this.base_amtShort.indexOf(' k') > -1 ?
        this.base_amtShort.substring(0, this.base_amtShort.length - 2) * 1000:
        this.base_amtShort * 1*/
    },
    customFilter(item, queryText) {
      const itemText = item.toLowerCase();
      const searchText = queryText.toLowerCase();
      const searchWords = searchText.split(/\s+/);
      return searchWords.every((word) => itemText.includes(word));
    },
    async updatePortfolio() {
      const previousStocks = new Set(this.portfolio.map((stock) => stock.id)); // Old selection
      const currentStocks = new Set(
        this.selectedFunds.map((stock) => stock.id)
      ); // New selection
      const inserts = this.selectedFunds.filter(
        (stock) => !previousStocks.has(stock.id)
      );
      // Deletes: Stocks that are in `portfolio` but NOT in `selectedStocks`
      const deletes = this.portfolio.filter(
        (stock) => !currentStocks.has(stock.id)
      );
      
      for (const [index, item] of inserts.entries()) {
        try {
          const resp = await this.$apollo.query({
            query: INSERT_USER_MF_PORTFOLIO,
            variables: {
              object: {
                mutual_fund_id: item.id,
                user: {
                  data: {
                    email: this.userGoogle.email,
                    google_id: this.userGoogle.uid,
                  },
                  on_conflict: {
                    constraint: "users_email_key",
                    update_columns: ["email"],
                  },
                },
              },
            },
            fetchPolicy: "no-cache",
          });
        } catch (e) {
          console.error(e);
        }
      }
      for (const [index, item] of deletes.entries()) {
        try {
          const resp = await this.$apollo.query({
            query: DELETE_USER_MF_PORTFOLIO,
            variables: {
              mutual_fund_id: item.id,
              email: this.userGoogle.email,
            },
            fetchPolicy: "no-cache",
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
    async getUserMFPortfolio() {
      if (!this.userGoogle.email) return;
      try {
        const resp = await this.$apollo.query({
          query: GET_USER_MF_PORTFOLIO,
          variables: {
            email: this.userGoogle.email,
          },
        });
        
        this.selectedMFs = resp.data.portfolio_mutual_funds.filter(m => m.mutual_fund.isDipSipETF === true).map((m) => {
          let returnsLabel = m.mutual_fund.return_3Y
            ? " (3 Y Returns " + m.mutual_fund.return_3Y + " %)"
            : "";
          for (let i = 1; i <= m.mutual_fund.star_rating; i++)
            returnsLabel += "⭐";
          return {
            id: m.mutual_fund.id,
            name: m.mutual_fund.name,
            displayName: m.mutual_fund.name + returnsLabel,
          };
        });
        this.selectedFunds = this.selectedMFs;
        this.portfolio = this.selectedMFs;
        const userConfig = resp.data.users[0].user_configs.filter(c => c.key === "dipsip_etf_config")
        
        if (userConfig && userConfig.length > 0){
          const userConfigObj = JSON.parse(userConfig[0].value)
        this.trigger = userConfigObj.trigger
        this.base_amt = userConfigObj.base_amt
        this.buy_factor = userConfigObj.buy_factor
        }
        else {
          this.trigger = 1
          this.base_amt = 100
          this.buy_factor = 1
        }
        
      } catch (e) {
        console.error(e);
      }
    },
    async fetchFundList() {
      try {
        const response = await api.get("/api/mutualfunds/list?isDipSipETF=true");
        this.fundList = response.data.map((m) => {
          let returnsLabel = m.return_3Y
            ? " (3 Y Returns " + m.return_3Y + " %)"
            : "";
          for (let i = 1; i <= m.star_rating; i++) returnsLabel += "⭐";
          return {
            id: m.id,
            name: m.name,
            displayName: m.name + returnsLabel,
          };
        });
      } catch (error) {
        console.error("Error fetching fund list:", error);
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },
};
</script>
<style scoped>
.left-panel {
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.right-panel {
  height: 100vh;
  overflow-y: auto;
}

@media (max-width: 960px) {
  .left-panel {
    height: auto;
    position: relative;
  }
}
</style>
