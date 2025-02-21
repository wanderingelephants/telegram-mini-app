<template>
  <v-container fluid class="fill-height pa-0">
    <v-responsive>
    <v-row no-gutters class="fill-height">
        <v-col>
              <!--<google-sign-in/> -->
              </v-col>
      <v-col
        cols="12"
        md="6"
        order="first"
        order-md="first"
        class="left-panel"
      >
        <v-card class="fill-height d-flex flex-column ma-2">
          <v-card-title  class="text-wrap">Regret Buying on Highs ?</v-card-title>
          <v-card-subtitle
            >Try DipSIP. A proven contra strategy.</v-card-subtitle
          >
          <v-card-text class="d-flex align-center flex-wrap">
            <span>Select ETFs below, Invest Rs.</span>
            <v-select
              theme="light"
              @update:menu="frameworkParamsChanged"
              v-model="base_amtShort"
              :items="[
                '100',
                '1 k',
                '2 k',
                '5 k',
                '10 k',
                '20 k',
                '50 k',
              ]"
              variant="underlined"
              label=""
              class="mx-1 mb-4"
              style="max-width: 70px; min-width: 50px"
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
                  Select Your ETFs
                  <a
                    href="#"
                    @click.prevent="selectionCriteriaDialog = true"
                    class="text-right text-decoration-none"
                  >
                    Selection Criteria
                  </a>
                </v-card-title>
                <v-combobox
                  multiple
                  v-model="etfSelected"
                  :items="etfList"
                  variant="outlined"
                >
                </v-combobox>
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
                          Hence, we will present to users well-researched ETFs,
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
      <!--<v-col cols="12" md="6" order="last" order-md="last" class="right-panel">
        <prompt-chat :systemPrompt="systemPrompt" :title="title" :subTitles="subTitles" :userInputLabel="userInputLabel" :debug="debug"></prompt-chat>
      </v-col> -->
    </v-row>
    </v-responsive>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import api from "./api";

export default {
  components: {
  },
  computed: mapState([
    "loggedInGoogle",
    "userGoogle",
  ]),
  watch: {
    /*messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    },*/
    
  },
  async mounted() {
    try {
      const resp = await api.get("/api/nse/instruments");

      this.etfList = resp.data.map((_) => {
        return { value: _.symbol, title: "(" + _.symbol + ") " + _.underlying };
      });
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      userInput: "",
      messages: [],
      isLoading: false,
      selectionCriteriaDialog: false,
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
      this.showSaveConfigDialog = true;
    },
    frameworkParamsChanged(){
        this.base_amt = this.base_amtShort.indexOf(' k') > -1 ?
        this.base_amtShort.substring(0, this.base_amtShort.length - 2) * 1000:
        this.base_amtShort * 1
    },
    async deleteConfig() {
      try {
        const resp = await api.post("/api/db/saveconfig", {
          tg_id: this.$store.state.userGoogle.tg_id,
          unsubscribe: true
        });
        if (resp.status == 200) {
          this.snackbar.show = true;
          this.snackbar.message = "Unsubscribed !";
          this.snackbar.color = "success";
        } else {
          this.snackbar.show = true;
          this.snackbar.message = "Pls try later !";
          this.snackbar.color = "error";
        }
      } catch (e) {
        this.snackbar.show = true;
        this.snackbar.message = "Pls try later !";
        this.snackbar.color = "error";
      }
    },
    async handleTelegramAuth(userTG) {
      try {
        const response = await api.post("/api/telegram/auth", {
          "userTG": userTG,
          "userGoogle": this.userGoogle
        })
        const { token, userRecord, configRecord } = response.data;
        this.accountExpiry = new Date(userRecord.expiry_date);
        if (configRecord) {
          if (configRecord.base_amt) {
            this.base_amt = configRecord.base_amt;
            this.base_amtShort = this.base_amt / 1000 + " k";
          }
          if (configRecord.trigger) this.trigger = configRecord.trigger;
          if (configRecord.buy_factor)
            this.buy_factor = configRecord.buy_factor;
          if (configRecord.instrument) {
            this.etfSelected = [];
            const userEtfs = configRecord.instrument.split(",");
            for (const e of userEtfs) {
              this.etfSelected.push(
                this.etfList.find((et) => et.value === e.trim())
              );
            }
          }
          //this.etfSelected = configRecord.instrument.split(",");
        } else console.log("No User Config Saved so far");

      } catch (error) {
        console.error("Authentication failed:", error);
      }
    },
    async saveConfigApi() {
      this.showSaveConfigDialog = false;
      try {
        const token = localStorage.getItem('jwt')
        const resp = await api.post("/api/db/saveconfig",
        {
          tg_id: this.userGoogle.tg_id,
          trigger: this.trigger,
          base_amt: this.base_amt,
          buy_factor: this.buy_factor,
          instrument: this.etfSelected.map((e) => e.value).join(", ")
        },{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }});
        if (resp.status == 200) {
          this.snackbar.show = true;
          this.snackbar.message = "Params Saved";
          this.snackbar.color = "success";
        } else {
          this.snackbar.show = true;
          this.snackbar.message = "Params Not Saved";
          this.snackbar.color = "error";
        }
      } catch (e) {
        this.snackbar.show = true;
        this.snackbar.message = "Params Not Saved";
        this.snackbar.color = "error";
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
