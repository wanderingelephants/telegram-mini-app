<template>
  <v-container fluid class="fill-height pa-0">
    <v-responsive>
    <v-row no-gutters class="fill-height">
      <v-col
        cols="12"
        md="6"
        order="first"
        order-md="first"
        class="fill-height"
      >
        <v-card class="fill-height d-flex flex-column ma-2">
          <v-card-title  class="text-wrap">Regret Buying on Highs ?</v-card-title>
          <v-card-subtitle
            >Try DipSIP. A proven contra strategy.</v-card-subtitle
          >

          <v-card-text class="d-flex align-center flex-wrap">
            <span>Invest Rs.</span>
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
              class="mx-1"
              style="max-width: 100px; min-width: 80px"
              density="compact"
              hide-details
            />
            <span
              >in each of the ETFs selected below, whenever they correct by more
              than</span
            >
            <v-select
              theme="light"
              label=""
              max-width="70px"
              @update:menu="frameworkParamsChanged"
              v-model="trigger"
              :items="['1', '2', '3', '4', '5']"
              variant="underlined"
              class="mx-1"
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
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="loggedInGoogle">
            <v-col v-if="loggedInTG == false">
                <v-card>
                    <v-card-text>This service sends notification using Telegram, being more reliable and performant than e-mail.</v-card-text>
                    <TelegramLogin
                  :botName="botName"
                  @telegram-auth="handleTelegramAuth"
                />
                </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters class="mb-1">
        <v-col v-if="loggedInTG == true" >
          <button
            @click="saveConfig"
            class="v-btn v-theme--light text-primary v-btn--density-default v-btn--size-default v-btn--variant-outlined"
          >
            Save
          </button>
        </v-col>
        <v-col v-if="loggedInTG == true" >
          <button
            @click="deleteConfig"
            class="v-btn v-theme--light text-primary v-btn--density-default v-btn--size-default v-btn--variant-outlined"
          >
            Unsubscribe
          </button>
        </v-col>
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
      <v-col cols="12" md="6" order="last" order-md="last" class="fill-height">
        <v-card class="fill-height d-flex flex-column ma-2">
          <!-- Chat Header -->
          <v-card-title class="primary white--text">
            Your DipSip Assistant (Free version, slow performance)
          </v-card-title>
          <v-card-subtitle
            >Ask Questions about how DipSIP works</v-card-subtitle
          >

          <!-- Messages Area -->
          <v-card-text
            class="flex-grow-1 overflow-y-auto"
            ref="messagesContainer"
          >
            <v-list two-line>
              <template v-for="(message, index) in messages" :key="index">
                <v-list-item
                  :class="message.role === 'user' ? 'justify-end' : ''"
                >
                  <v-list-item-content
                    :class="[
                      'rounded-lg pa-3 ma-2',
                      message.role === 'user'
                        ? 'blue lighten-4 ml-auto'
                        : 'grey lighten-3',
                      'max-width-75',
                    ]"
                  >
                    <v-list-item-title class="mb-2">
                      {{ message.role === "user" ? "You" : "Assistant" }}
                    </v-list-item-title>
                    <div class="message-content">
                      {{ message.content }}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <!-- Loading indicator -->
              <v-list-item v-if="isLoading">
                <v-list-item-content
                  class="grey lighten-3 rounded-lg pa-3 ma-2"
                >
                  <v-list-item-subtitle>
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      size="24"
                      class="mr-2"
                    ></v-progress-circular>
                    Fetching Your Response...
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <!-- Input Area -->
          <v-card-actions class="pa-4">
            <v-text-field
              v-model="userInput"
              label="Learn how to maximize Returns with SIP principles"
              :disabled="isLoading"
              variant="outlined"
              density="comfortable"
              hide-details
              @keyup.enter="sendMessage"
              append-inner-icon="mdi-send"
              @click:append-inner="sendMessage"
            ></v-text-field>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    </v-responsive>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import api from "./api";
import TelegramLogin from "../components/TelegramLogin.vue";

export default {
  components: {
    TelegramLogin
  },
  computed: mapState([
    "loggedInTG",
    "userTG",
    "loggedInGoogle",
    "userGoogle",
  ]),
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    },
    '$store.state.loggedInGoogle': {
    async handler(newValue) {
      if (newValue === true) {
        await this.fetchFundList();
      }
    },
    immediate: true  // This will check the value when component is created
  }
  },
  async mounted() {
    try {
      const resp = await api.get("/api/nse/instruments");

      this.etfList = resp.data.map((_) => {
        return { value: _.symbol, title: "(" + _.symbol + ") " + _.underlying };
      });
      console.log(this.etfList);
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
      showSaveConfigDialog: false
    };
  },
  methods: {
    async sendMessage() {},
    async saveConfig() {
      console.log(this.etfSelected);
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
          tg_id: this.$store.state.userTG.id,
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
        console.log("POST", userTG, this.userGoogle, this.loggedInGoogle)
        /*const response = await axios.get("/api/telegram/auth", {
          params: userTG,
        });*/
        const response = await api.post("/api/telegram/auth", {
          "userTG": userTG,
          "userGoogle": this.userGoogle
        })
        const { token, userRecord, configRecord } = response.data;
        console.log("token", token)
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
              console.log("userEtf", e);
              console.log(this.etfList.find((et) => et.value === e.trim()));
              this.etfSelected.push(
                this.etfList.find((et) => et.value === e.trim())
              );
            }
          }
          //this.etfSelected = configRecord.instrument.split(",");
        } else console.log("No User Config Saved so far");

        // Store the JWT in localStorage or a secure cookie
        localStorage.setItem("jwt", token);
        // You might want to update your app's state here
        this.$store.commit("setloggedInTG", true);
        this.$store.commit("setUserTG", userTG);
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    },
    async saveConfigApi() {
      this.showSaveConfigDialog = false;
      try {
        const token = localStorage.getItem('jwt')
        console.log("token", token)
        //const resp = await axios.post("/api/db/saveconfig", 
        const resp = await api.post("/api/db/saveconfig",
        {
          tg_id: this.userTG.id,
          tg_username: this.userTG.username,
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