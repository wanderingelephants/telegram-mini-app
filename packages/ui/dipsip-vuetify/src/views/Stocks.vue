<template>
  <v-responsive>
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <v-col
          cols="12"
          md="6"
          order="first"
          order-md="first"
          class="left-panel"
        >
          <!--<google-sign-in/>  -->
          <prompt-chat
            :distilledModel="distilledModel"
            :title="title"
            :subTitles="subTitles"
            :userInputLabel="userInputLabel"
            :debug="debug"
          ></prompt-chat>
        </v-col>
        <v-col
          cols="12"
          md="6"
          order="last"
          order-md="last"
          class="right-panel"
        >
          <v-card-text v-if="loggedInGoogle === true"
            >Welcome {{ userGoogle.displayName }}</v-card-text
          >
          <v-card>
            <v-card-title class="subtitle-wrap"
              >We are NOT registered with SEBI. We do not execute any trades, or
              take any deposits.</v-card-title
            >
            <v-card-title class="subtitle-wrap"
              >No Investment advice. Only providing DIY query
              tools.</v-card-title
            >
            <google-sign-in />
            <v-card-text>
              <v-btn @click="updateWatchList" color="primary"
                >Update Watch List</v-btn
              >
              <v-autocomplete
                v-model="selectedStocks"
                :items="stocks"
                item-title="company_name"
                :custom-filter="customFilter"
                item-value="id"
                :label="
                  'Select Stocks ' +
                  (selectedStocks.length
                    ? `(${selectedStocks.length} selected)`
                    : '')
                "
                multiple
                chips
                closable-chips
                persistent-hint
                @update:model-value="handleStockSelection"
                :search="searchText"
                @update:search="handleSearch"
                return-object
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :text="item.raw.company_name"
                    variant="elevated"
                  >
                    <v-icon start>mdi-chart-line</v-icon>
                    {{ item.raw.company_name }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-card-text>
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

import GoogleSignIn from "../components/GoogleSignIn";
import api from "./api";
import MutualFundAnalysis from "../components/MutualFundAnalysis.vue";
import PromptChat from "./PromptChat.vue";
import {
  GET_STOCK_LIST,
  INSERT_PORTLFOLIO_STOCK,
  GET_USER_STOCK_PORTFOLIO,
  DELETE_USER_STOCK_PORTFOLIO,
} from "../lib/helper/queries";
export default {
  name: "ChatApp",
  components: {
    MutualFundAnalysis,
    PromptChat,
    GoogleSignIn,
  },
  data() {
    return {
      messages: [],
      userInput: "",
      isLoading: false,
      showError: false,
      errorMessage: "",
      stocks: [],
      selectedStocks: [],
      portfolio: [],
      compareData: {},
      inserts: [],
      deletes: [],
      searchText: "",
      title: "Stocks Helper Agent",
      subTitles: [
        "Ask what Google/ChatGPT cannot answer. E.g.",
        "Which companies reported insider trades in last one month",
        "Last one month, which companies made preferential offer announcements",
        "** Trained on Indian data, can make mistakes",
      ],
      userInputLabel: "This is an AI tool. Double Check",
      debug: false,
      distilledModel: "analysis_reasoning",
      analysisTypes: [
        {
          name: "Overlap",
          color: "primary",
          icon: "mdi-compare",
        },
        {
          name: "Diversification",
          color: "success",
          icon: "mdi-chart-pie",
        },
        {
          name: "Performance",
          color: "info",
          icon: "mdi-chart-line",
        },
        {
          name: "Fees",
          color: "warning",
          icon: "mdi-alert-circle-outline",
        },
      ],
    };
  },
  watch: {
    async loggedInGoogle(newVal) {},
    async userGoogle(newVal) {
      if (newVal.email) await this.getUserStockPortfolio();
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
    async updateWatchList() {
      const previousStocks = new Set(this.portfolio.map((stock) => stock.id)); // Old selection
      const currentStocks = new Set(
        this.selectedStocks.map((stock) => stock.id)
      ); // New selection
      const inserts = this.selectedStocks.filter(
        (stock) => !previousStocks.has(stock.id)
      );

      // Deletes: Stocks that are in `portfolio` but NOT in `selectedStocks`
      const deletes = this.portfolio.filter(
        (stock) => !currentStocks.has(stock.id)
      );
      for (const [index, item] of inserts.entries()) {
        try {
          const resp = await this.$apollo.query({
            query: INSERT_PORTLFOLIO_STOCK,
            variables: {
              object: {
                stock_id: item.id,
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
            query: DELETE_USER_STOCK_PORTFOLIO,
            variables: {
              stock_id: item.id,
              email: this.userGoogle.email,
            },
            fetchPolicy: "no-cache",
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
    async getUserStockPortfolio() {
      if (!this.userGoogle.email) return;
      try {
        const resp = await this.$apollo.query({
          query: GET_USER_STOCK_PORTFOLIO,
          variables: {
            email: this.userGoogle.email,
          },
        });
        this.selectedStocks = resp.data.portfolio_stocks.map((r) => {
          return {
            id: r.stock.id,
            company_name: r.stock.company_name,
          };
        });
        this.portfolio = this.selectedStocks;
      } catch (e) {
        console.error(e);
      }
    },
    async getStocks() {
      try {
        let res = await this.$apollo.query({
          query: GET_STOCK_LIST,
          variables: {},
          fetchPolicy: "no-cache",
        });
        this.stocks = res.data.stock;
      } catch (e) {
        console.error(e);
      }
    },

    handleSearch(val) {
      // The search text will be available in 'val'
      this.searchText = val;
    },
    handleStockSelection(value) {},

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },

  async mounted() {
    if (this.stocks.length == 0) await this.getStocks();
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