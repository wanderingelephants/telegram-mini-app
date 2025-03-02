<template>
  <v-responsive>
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <v-col cols="12">
          <google-sign-in />
          <v-card-text v-if="loggedInGoogle === true"
            >Welcome {{ userGoogle.displayName }}</v-card-text
          >
          <v-card>
            <v-card-title>We are NOT registered with SEBI.</v-card-title>
            <v-card-title class="subtitle-wrap"
              >No Investment advice. Only providing DIY query
              tools.</v-card-title
            >
            <v-card-title class="subtitle-wrap"
              >Select 2 or More Funds</v-card-title
            >
            <v-card-subtitle class="subtitle-wrap">
              Reduce Overlap
            </v-card-subtitle>
            <v-card-subtitle class="subtitle-wrap">
              Fee of ETFs can be 10X lower than Mutual Funds.
              <a href="/etfList">See ETFs</a>
            </v-card-subtitle>
            <v-card-text class="pb-0">
              <v-chip
                v-for="type in analysisTypes"
                :key="type.name"
                class="me-2 mb-2"
                :color="type.color"
                variant="outlined"
              >
                <v-icon>{{ type.icon }}</v-icon>
                {{ type.name }}
              </v-chip>
            </v-card-text>
            <v-card-text>
              <v-btn
                :disabled="selectedFunds.length <= 1"
                @click="sendCompare(selectedFunds)"
                color="amber"
                >Compare</v-btn
              >
              <v-btn @click="updatePortfolio" class="ml-2" color="primary"
                >Update Portfolio</v-btn
              >
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
            </v-card-text>
            <mutual-fund-analysis
              :analysisReport="compareData"
              v-if="compareData.overlaps"
            ></mutual-fund-analysis>
          </v-card>
        </v-col>
      </v-row>

      <!-- Error Snackbar -->
      <v-snackbar v-model="showError" color="error" timeout="3000">
        {{ errorMessage }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showError = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-responsive>
</template>

<script>
import { mapState } from "vuex";
import {
  GET_USER_MF_PORTFOLIO,
  INSERT_USER_MF_PORTFOLIO,
  DELETE_USER_MF_PORTFOLIO,
} from "../lib/helper/queries";
import GoogleSignIn from "../components/GoogleSignIn";
import api from "./api";
import MutualFundAnalysis from "../components/MutualFundAnalysis.vue";

export default {
  name: "ChatApp",
  components: {
    MutualFundAnalysis,
    GoogleSignIn,
  },
  data() {
    return {
      messages: [],
      userInput: "",
      isLoading: false,
      showError: false,
      errorMessage: "",
      fundList: [],
      selectedFunds: [],
      portfolio: [],
      compareData: {},
      searchText: "",
      title: "Mutual Fund Helper Agent",
      subTitles: [
        "Ask what Google/ChatGPT cannot answer. E.g.",
        "Find - किन म्यूचुअल फंडों में रिटर्न 20% से अधिक है, शुल्क 0.5% से कम है",
        "Stock Discovery - Which stocks are present in only 1 small cap fund",
        "Reasoning - Define Churn as stocks bought plus stocks sold in a fund. Which funds had highest churn",
        "** Trained on Indian data, can make mistakes",
      ],
      userInputLabel: "This is an AI tool. Double Check",
      debug: false,
      distilledModel: "analysis_reasoning",
      analysisTypes: [
        {
          name: "Overlap",
          color: "primary",
          icon: "$mdiCompare",
        },
        {
          name: "Diversification",
          color: "success",
          icon: "$mdiChartPie",
        },
        {
          name: "Performance",
          color: "info",
          icon: "$mdiChartLine",
        },
        {
          name: "Fees",
          color: "warning",
          icon: "$mdiCurrencyRupee",
        },
      ],
    };
  },
  watch: {
    async loggedInGoogle(newVal) {},
    async userGoogle(newVal) {
      if (newVal && newVal.email) {
        if (this.fundList.length === 0) await this.fetchFundList();
        await this.getUserMFPortfolio();
      }
    },
  },
  computed: mapState([
    // map this.count to store.state.count
    "loggedInGoogle",
    "userGoogle",
  ]),
  methods: {
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
      console.log("inserts", inserts)
      console.log("deletes", deletes)
      
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
        //console.log("resp", resp.data.portfolio_mutual_funds)
        this.selectedMFs = resp.data.portfolio_mutual_funds.filter(m => m.mutual_fund.isDipSipETF === false).map((m) => {
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
      } catch (e) {
        console.error(e);
      }
    },
    async fetchFundList() {
      try {
        const response = await api.get("/api/mutualfunds/list?isDipSipETF=false");
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

    async sendCompare() {
      try {
        const response = await api.post("/api/mutualfunds/analyze", {
          fundList: this.selectedFunds.map(f => f.name),
        });
        this.compareData = response.data;
      } catch (error) {
        console.error("Error in sendCompare:", error);
      }
    },
    handleSearch(val) {
      // The search text will be available in 'val'
      this.searchText = val;
    },
    /*handleFundSelection(value){
      this.portfolio.value = value.map(id => {
        const fund = this.fundList.find(f => f.id === id)
        return {
          ...fund,
          currentValue: '',
          investedDate: '',
          investedAmount: ''
        }
      })
      
    },*/

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },

  async mounted() {
    if (this.fundList.length == 0) await this.fetchFundList();
  },
};
</script>
<style scoped>
.message-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
  max-width: 100%;
}
.subtitle-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}
.max-width-75 {
  max-width: 75%;
}

/* Add these styles if you want to preserve specific formatting */
.v-list-item-content {
  width: 100%;
}

.v-list-item {
  align-items: flex-start;
}
.max-width-75 {
  max-width: 75%;
}

.text-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}

/* Custom scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
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