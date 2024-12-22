<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="400">
      <v-row no-gutters>
        <!--<v-col cols="6">
          <h2 class="green">Smart ETF SIPs</h2>
        </v-col> -->
        <v-col cols="12" v-if="loggedIn == false">
          <v-tooltip
            v-model="showTooltip_tg"
            location="top"
            :open-on-click="true"
            :open-on-hover="false"
          >
            <template v-slot:activator="{ props }">
              <div v-bind="props" @click.stop="toggleTooltip">
                <TelegramLogin
                  :botName="botName"
                  @telegram-auth="handleTelegramAuth"
                />
                <!--<v-icon size="small" color="grey" class="ml-1">
                  mdi-information-outline
                </v-icon>-->
              </div>
            </template>
            <!--<span>{{ tooltip_tg }}</span>-->
          </v-tooltip>
        </v-col>
        <!--<v-col cols="6" v-if="loggedIn == true">
          <div>Welcome {{user.username}}</div>
        </v-col> -->
      </v-row>
      <h7 class="text-h7 mt-1">How it Works - Simple Notification Service. So, you never miss Golden Opportunities. 12 pm every day, if any ETF corrects more than your trigger, you get a TG Notification. Based on your Investment Params, we suggest the Order amount and price, that you can edit, and execute on your brokerage. Zerodha users can place pre-filled orders.</h7>
      <h5 class="text-h5 mt-1">Investment Parameters</h5>
      <v-row>
        <!--<v-col cols="3">
          <v-select
            max-width="150px"
            label="Start Date"
            theme="light"
            @update:menu="frameworkParamsChanged"
            v-model="startDate"
            :items="[
              '01/01/2019',
              '01/01/2018',
              '01/01/2017',
              '01/01/2016',
              '01/01/2015',
              '01/01/2014',
              '01/01/2013',
              '01/01/2012',
              '01/01/2011',
              '01/01/2010',
              '01/01/2009',
              '01/01/2008',
              '01/01/2007',
              '01/01/2006',
              '01/01/2005',
            ]"
            variant="underlined"
          ></v-select>
        </v-col> -->
        <v-col cols="6">
          <div class="d-flex align-center">
            <v-select
              theme="light"
              @update:menu="frameworkParamsChanged"
              v-model="base_amtShort"
              :items="[
                '1 k',
                '10 k',
                '20 k',
                '30 k',
                '40 k',
                '50 k',
                '60 k',
                '70 k',
                '80 k',
                '90 k',
              ]"
              variant="underlined"
              label="Amount"
            />
            <v-tooltip
              location="top"
              :text="tooltip_baseAmt"
              :open-on-click="true"
              :open-on-hover="false"
            >
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="small" color="grey" class="ml-1">
                  mdi-information-outline
                </v-icon>
              </template>
            </v-tooltip>
          </div>
        </v-col>

        <v-col cols="6">
          <div class="d-flex align-center">
            <v-select
              theme="light"
              label="Trigger (%)"
              max-width="70px"
              @update:menu="frameworkParamsChanged"
              v-model="trigger"
              :items="['1', '2', '3', '4', '5']"
              variant="underlined"
            ></v-select>
            <v-tooltip
              location="top"
              :text="tooltip_trigger"
              :open-on-click="true"
              :open-on-hover="false"
            >
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="small" color="grey" class="ml-1">
                  mdi-information-outline
                </v-icon>
              </template>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <div class="d-flex align-center">
            <v-slider
              max-width="300px"
              class="ml-1 mr-1"
              v-model="buy_factor"
              :onEnd="frameworkParamsChanged"
              :max="2"
              :min="1"
              :step="0.01"
              thumb-label
              elevation="2"
              thumb-size="20"
            >
              <template v-slot:prepend>
                <v-btn
                  :color="color"
                  icon="mdi-minus"
                  size="small"
                  variant="text"
                  @click="decrementTrigger"
                ></v-btn>
              </template>

              <template v-slot:append>
                <v-btn
                  @click="incrementTrigger"
                  :color="color"
                  icon="mdi-plus"
                  size="small"
                  variant="text"
                ></v-btn>
              </template>
            </v-slider>
            <v-tooltip
              location="top"
              :text="tooltip_buy_factor"
              :open-on-click="true"
              :open-on-hover="false"
            >
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="small" color="grey" class="ml-1">
                  mdi-information-outline
                </v-icon>
              </template>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-card class="pb-2" color="primary" theme="light" max-width="380px">
            <v-card-title
              >Allocation (Factor
              {{ Math.round(buy_factor * 100) / 100 }})</v-card-title
            >
            <v-card-subtitle
              >Scroll. Deeper Correction, Bigger Allocation</v-card-subtitle
            >
            <!--<template v-slot:title>
                <span class="font-weight-black"
                  >Allocation (Factor
                  {{ Math.round(buy_factor * 100) / 100 }})</span
                >
              </template> -->
            <v-table
              density="compact"
              theme="light"
              class="ml-2 mr-2"
              height="100px"
              fixed-header
            >
              <thead>
                <tr>
                  <th class="text-left">Correction %</th>
                  <th class="text-left">Investment</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in correctionTable" :key="item.correction">
                  <td>{{ item.correction }}</td>
                  <td>{{ item.invested.toLocaleString() }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
      <!--<v-row no-gutters class="mt-2">
        <v-col cols="12">
          <v-card class="pb-2" color="primary" theme="light" max-width="280px">
            <v-card-title class="d-flex justify-space-between align-center">
              Performance
              <v-btn variant="text" @click="openPerformanceDetails"
                >Details</v-btn
              >
            </v-card-title>
            <v-table
              density="compact"
              theme="light"
              class="ml-2 mr-2"
              height="80px"
              fixed-header
            >
              <thead>
                <tr>
                  <th class="text-left">Units</th>
                  <th class="text-left">Invested</th>
                  <th class="text-left">Current</th>
                  <th class="text-left">XIRR %</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td nowrap>
                    {{ Math.round(totalUnitsBought * 100) / 100 }}
                  </td>
                  <td>{{ Math.round(totalInvestment).toLocaleString() }}</td>
                  <td>{{ Math.round(currentValue).toLocaleString() }}</td>
                  <td>{{ Math.round(returnsFromInvestment * 100) }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row> -->
      <v-row no-gutters class="mt-2">
        <v-col cols="12">
          <v-card class="pb-2" color="primary" theme="light" max-width="100%">
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
            <v-card-subtitle v-if="false"
              >Check Zerodha for Details by using (ETF Code)</v-card-subtitle
            >
            <v-combobox
              multiple
              v-model="etfSelected"
              :items="etfList"
              variant="outlined"
            >
            </v-combobox>
            <v-dialog v-model="selectionCriteriaDialog" width="500">
              <v-card class="pb-2" color="primary" theme="light" max-width="100%">
                <v-card-title class="text-h5 grey lighten-2">
                  Selection Criteria
                  
                 
                </v-card-title>
                <v-card-action>
                   <v-btn class="v-btn v-theme--light text-primary v-btn--density-default v-btn--size-default v-btn--variant-outlined" block @click="selectionCriteriaDialog = false">Close</v-btn>
                </v-card-action>
                <v-card-text class="mt-4">
                  <ul>
                  <li>One of the core objectives of this Platform is to declutter and filter the investment options for end users.</li>
                  <li>With more than 2500 Mutual Fund schemes alone, it is tough to filter. Cost comes later.</li>
                  <li>We believe Passive Investments offer best risk adjusted returns over long term.</li>
                  <li>Hence, we will present to users well-researched ETFs, which are low cost, liquid and there is public data to analyze them.</li>
                  <li>To keep overlap to a minimum we have Kotak's Bank Nifty, Zerodha Mid150Case, ICICI Pru Bharat22 (Blue Chip), Nexus REIT (exposure to commerical real estate), GOLDCASE (Gold exposure), MAFANG (NYSE Facebook-Apple-Netflix-Google-Plus theme)</li>
                  
                  </ul>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col v-if="loggedIn == true" >
          <button
            @click="saveConfig"
            class="v-btn v-theme--light text-primary v-btn--density-default v-btn--size-default v-btn--variant-outlined"
          >
            Save
          </button>
        </v-col>
        <v-col v-if="loggedIn == false" >
          <v-card-text>Login with Telegram above, to Save</v-card-text>
        </v-col>
        <!--<v-col cols="8">
          Expiry
          {{
            accountExpiry.toLocaleString("default", {
              month: "short",
              year: "numeric",
              day: "numeric",
            })
          }}
        </v-col> -->
      </v-row>
      <v-dialog v-model="dialog" width="auto">
        <v-card color="primary" theme="light">
          <v-card-title class="d-flex justify-space-between align-center">
            Details (Till
            {{
              currentDate.toLocaleString("default", {
                month: "short",
                year: "numeric",
              })
            }})
            <a
              href="https://in.investing.com/indices/bank-nifty-historical-data"
              target="_blank"
              >Source Data</a
            >
          </v-card-title>

          <v-table
            density="compact"
            theme="light"
            class="ml-2 mr-2"
            height="300px"
            fixed-header
          >
            <thead>
              <tr>
                <th class="text-left">Date</th>
                <th class="text-left">Price</th>
                <th class="text-left">Down</th>
                <th class="text-left">Invested</th>
                <th class="text-left">Units</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in investments" :key="item.date">
                <td nowrap>
                  {{
                    (item.investmentDate.getDate() > 9 ? "" : "0") +
                    item.investmentDate.getDate() +
                    "/" +
                    (item.investmentDate.getMonth() + 1 > 9 ? "" : "0") +
                    (item.investmentDate.getMonth() + 1) +
                    "/" +
                    (item.investmentDate.getFullYear() * 1 - 2000 > 9
                      ? ""
                      : "0") +
                    (item.investmentDate.getFullYear() * 1 - 2000)
                  }}
                </td>
                <td>{{ Math.round(item.price) }}</td>
                <td>{{ Math.round(item.correction * 100) / 100 }}</td>
                <td>{{ item.investmentAmount.toLocaleString() }}</td>
                <td>{{ Math.round(item.unitsBought * 100) / 100 }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-card-actions>
            <v-btn block @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
              <v-card-text>Factor: {{ buy_factor }}</v-card-text>
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
    </v-responsive>
  </v-container>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
<script setup>
const title = import.meta.env.VITE_APP_TITLE;
const botName = import.meta.env.VITE_TG_BOT_NAME;
</script>
<script>
import { mapState } from "vuex";
import api from "./api";
import TelegramLogin from "../components/TelegramLogin.vue";
import axios from "axios";
import market_data from "./indices.json";
export default {
  components: {
    TelegramLogin,
  },
  computed: mapState([
    // map this.count to store.state.count
    "loggedIn",
    "user",
  ]),
  methods: {
    async handleTelegramAuth(user) {
      try {
        const response = await axios.get("/api/telegram/auth", {
          params: user,
        });
        const { token, userRecord, configRecord } = response.data;
        this.accountExpiry = new Date(userRecord.expiry_date);
        console.log("handleTelegramAuth config", configRecord);
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
        this.$store.commit("setLoggedIn", true);
        this.$store.commit("setUser", user);
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    },
    incrementTrigger() {
      if (this.buy_factor < 2) this.buy_factor += 0.01;
      this.frameworkParamsChanged();
    },
    decrementTrigger() {
      if (this.buy_factor > 1) this.buy_factor -= 0.01;
      this.frameworkParamsChanged();
    },
    frameworkParamsChanged() {
      this.base_amt =
        this.base_amtShort.substring(0, this.base_amtShort.length - 2) * 1000;
      this.correctionTable = [];
      for (let i = 0; i < 46; i++) {
        const correction = Math.round((this.trigger * 1 + i * 0.2) * 100) / 100;
        if (correction <= 10) {
          const invested = Math.round(
            this.base_amt *
              Math.pow(this.buy_factor, correction * 1 - this.trigger * 1)
          );
          this.correctionTable.push({ correction, invested });
        }
      }
      this.populateMarket();
      this.makeInvestments();
    },
    xirr(cashflows, dates, guess, currentValue, currentDate) {
      if (cashflows.length !== dates.length) {
        throw new Error(
          "Cashflows and dates arrays must have the same length."
        );
      }
      cashflows.unshift(currentValue);
      dates.unshift(currentDate);
      guess = guess || 0.1; // Default guess of 10%

      let x = guess;
      let maxIterations = 100;
      let tolerance = 0.00001;

      for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dNpv = 0;

        for (let j = 0; j < cashflows.length; j++) {
          const diffTime = dates[j] - dates[0];
          let days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          let factor = Math.pow(1 + x, days / 365);
          npv += cashflows[j] / factor;
          dNpv -= (cashflows[j] * days) / 365 / factor / (1 + x);
        }
        if (Math.abs(npv) < tolerance) {
          return x;
        }

        x -= npv / dNpv;
      }
      throw new Error("XIRR calculation did not converge.");
    },
    makeInvestments() {
      this.investments = [];
      const candidates = this.market.filter(
        (m) => m.deltaPercent <= this.trigger * -1
      );

      for (const c of candidates) {
        const investedAmt = Math.round(
          this.base_amt *
            Math.pow(
              this.buy_factor,
              Math.abs(c.deltaPercent) * 1 - this.trigger * 1
            )
        );
        const unitsBought = investedAmt / c.price;
        c.unitsBought = unitsBought;
        c.investedAmt = investedAmt;
        this.investments.push({
          investmentAmount: investedAmt,
          unitsBought,
          price: c.price,
          investmentDate: c.date,
          correction: c.deltaPercent,
        });
      }
      this.totalUnitsBought = candidates.reduce(
        (acc, c) => acc + c.unitsBought * 1,
        0
      );
      this.totalInvestment = candidates.reduce(
        (acc, c) => acc + c.investedAmt * 1,
        0
      );
      this.currentValue = this.totalUnitsBought * this.market[0].price;
      this.returnsFromInvestment = this.xirr(
        this.investments.map((i) => i.investmentAmount * -1),
        this.investments.map((i) => i.investmentDate),
        0.12,
        this.currentValue,
        this.currentDate
      );
    },
    async saveConfig() {
      console.log(this.etfSelected);
      this.showSaveConfigDialog = true;
    },
    async getInstrumentList(){
      try{
        const resp = await api.get('/api/nse/instruments')
        
        this.etfList = resp.data.map(_ => {return {value: _.symbol, title: _.underlying}})
        console.log(this.etfList)
      }
      catch(e){
        console.log(e)
      }
    },
    async saveConfigApi() {
      this.showSaveConfigDialog = false;
      try {
        const resp = await api.post("/api/db/saveconfig", {
          tg_id: this.$store.state.user.id,
          tg_username: this.$store.state.user.username,
          trigger: this.trigger,
          base_amt: this.base_amt,
          buy_factor: this.buy_factor,
          instrument: this.etfSelected.map((e) => e.value).join(", "),
        });
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
    openPerformanceDetails() {
      this.dialog = true;
    },
    populateMarket() {
      const tradingDates = market_data.dates; //);
      const currentDateToks = tradingDates[0].split("-");
      this.currentDate = new Date(
        currentDateToks[2] + "-" + currentDateToks[1] + "-" + currentDateToks[0]
      );
      const startingDateToks = this.startDate.split("/");
      const startDate = new Date(
        startingDateToks[2] +
          "-" +
          startingDateToks[1] +
          "-" +
          startingDateToks[0]
      );

      this.market = [];
      for (let i = 0; i < tradingDates.length; i++) {
        const d = tradingDates[i];
        const price = market_data.bank_nifty[i];
        let prevPrice = 0;
        let deltaPercent = 0;
        if (i < tradingDates.length - 1) {
          prevPrice = market_data.bank_nifty[i + 1];
          deltaPercent = ((price - prevPrice) * 100) / prevPrice;
        }
        const toks = d.split("-");
        const date = new Date(toks[2] + "-" + toks[1] + "-" + toks[0]);
        if (date.getTime() < startDate.getTime()) break;
        this.market.push({
          date,
          price,
          prevPrice,
          deltaPercent,
        });
      }
    },
  },
  async mounted() {
    await this.getInstrumentList()
    this.isProduction = process.env.NODE_ENV === "dev" ? false : true;
    this.frameworkParamsChanged();
  },
  data() {
    return {
      isProduction: true,
      dialog: false,
      showInvestmentDetails: false,
      color: "teal",
      buy_factor: 1.33,
      base_amtShort: "10 k",
      base_amt: 10000,
      showTooltip_tg: false,
      tooltip_tg:
        "Why Telegram ? It offers the best encryption and privacy preserving features. Notice here, no collection of your gmail, phone, OTPs etc",
      tooltip_baseAmt:
        "Base Amt is the minimum invested amount, on which the Allocation Factor is applied. Each investment is therefore small, and relatively low risk, but staggered trades over long periods of time add up to big compounding corpus.",
      tooltip_trigger:
        "You invest when Market (i.e. this index) falls more than this percentage",
      tooltip_buy_factor:
        "Allocation Factor: A function, that increases allocation as market correction increases. Factor of 1 means constant base amount, irrespective of correction severity. Factor of 2 (most aggressive) means investment amount doubles on every 1 % correction.",
      trigger: 1.0,
      correctionTable: [],
      market: [],
      currentDate: "",
      returnsFromInvestment: 0,
      totalUnitsBought: 0,
      totalInvestment: 0,
      currentValue: 0,
      startDate: "01/01/2019",
      investmentAmounts: [],
      investmentDates: [],
      investments: [],
      limit_price: 520,
      last_trade_price: "",
      prev_closing_price: "",
      showKiteBtn: false,
      showDoneBtn: true,
      snackbar: {
        show: false,
        message: "",
        timeout: 3000,
        color: "orange",
      },
      showSaveConfigDialog: false,
      accountExpiry: "",
      etfList: [],
      etfSelected: [],
      selectionCriteriaDialog: false
    };
  },
};
</script>
