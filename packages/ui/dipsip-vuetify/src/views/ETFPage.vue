<template>
  <div>
    <v-container>
      <v-row justify="center" align="center" nogutters>
        
        <v-col cols="6">
          <div class="d-flex align-center">
            <v-select
              theme="light"
              @update:menu="updateInvestments"
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
              @update:menu="updateInvestments"
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
        <v-col>
          <div class="d-flex align-center">
            <v-slider
              max-width="300px"
              class="ml-1 mr-1"
              v-model="buy_factor"
              :onEnd="updateInvestments"
              :max="2"
              :min="1"
              :step="0.01"
              thumb-label
              elevation="2"
              thumb-size="20"
            >
            <template v-slot:label>
    Allocation Factor
  </template>
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
              <template v-slot:thumb-label="{ modelValue }">
    {{ modelValue.toFixed(2) }}
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
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="12">
          <v-card
            class="pb-2"
            color="#FFA000"
            theme="light"
            :max-width="$vuetify.display.mdAndDown ? '380px' : '100%'"
          >
            <v-card-title>ETFs</v-card-title>
            <v-card-subtitle
              >Scroll Right for all columns.</v-card-subtitle
            >
             <v-card-subtitle
              >Returns (XIRR) calculated for 6 years from Jan-2019</v-card-subtitle
            >
            <v-card-text>DipSip on Volatile Indexes Presents Better and More Investing Opportunities. Increasing the Allocation Factor, improves Returns because you buy more, when index corrects more.</v-card-text>
            <v-card-text>MAKEINDIA, DIGITALINDIA Data only from 2022 onwards</v-card-text>
            <div class="table-wrapper">
            <v-table
              density="compact"
              theme="light"
              class="ml-2 mr-2 responsive-table"
              fixed-header
            >
              <thead>
                <tr>
                  <th class="text-left sticky-col first-col">Code</th>
                  <th class="text-left sticky-col second-col text-nowrap">DipSIP %</th>
                  <th class="text-left text-nowrap">Investment</th>
                  
                  <th class="text-left text-nowrap">₹ Final (DipSIP)</th>
                  <th class="text-left text-nowrap">SIP %</th>
                  <!-- <th class="text-left text-nowrap">₹ Invested</th> -->
                  <th class="text-left text-nowrap">₹ Final (SIP)</th>
                  <th class="text-left">Underlying</th>
                  <th class="text-left">Details</th> 
                  
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in etfList" :key="item.symbol">
                  <td class="sticky-col first-col">{{ item.symbol }}</td>
                  <td  class="sticky-col second-col">{{ Math.round(returnsFromInvestment[item.symbol][true]*10000)/100 }}</td>
                  <td>{{ Math.round(totalInvestment[item.symbol][true]).toLocaleString() }}</td>
                  <td>{{ Math.round(currentValue[item.symbol][true]).toLocaleString() }}</td>
                  <td>{{ Math.round(returnsFromInvestment[item.symbol][false]*10000)/100 }}</td>
                  <!--<td>{{ Math.round(totalInvestment[item.symbol][false]).toLocaleString() }}</td> -->
                  <td>{{ Math.round(currentValue[item.symbol][false]).toLocaleString() }}</td>
                  <td>{{ item.underlying }}</td>
                  <td>
                    <v-dialog v-model="showChart[item.symbol]" width="1000">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props">
        Details
      </v-btn>
    </template>
    
    <investment-chart v-if="showChart[item.symbol]"
      :price-data="market[item.symbol]"
      :strategy1-data="investments[item.symbol][true]"
      :strategy2-data="investments[item.symbol][false]"
    />
    <v-btn @click="showChart[item.symbol] = false">Close</v-btn>
  </v-dialog>
                  </td>
                </tr>
              </tbody>
            </v-table>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>

import InvestmentChart from '../components/InvestmentChart.vue'

import api from "./api";
import AUTOBEES from "./indices/AUTOBEES.json";
import GOLDBEES from "./indices/GOLDBEES.json";
import MAKEINDIA from "./indices/MAKEINDIA.json";
import NIFTYBEES from "./indices/NIFTYBEES.json";
import SHARIABEES from "./indices/SHARIABEES.json";
import SMALLCAP from "./indices/SMALLCAP.json";
import BANKBEES from "./indices/BANKBEES.json";
import ITBEES from "./indices/ITBEES.json";
import MID150BEES from "./indices/MID150BEES.json";
import PHARMABEES from "./indices/PHARMABEES.json";
import SILVERBEES from "./indices/SILVERBEES.json";
import TNIDETF from "./indices/TNIDETF.json";
const etfImports = {
  AUTOBEES,
  GOLDBEES,
  MAKEINDIA,
  NIFTYBEES,
  SHARIABEES,
  SMALLCAP,
  BANKBEES,
  ITBEES,
  MID150BEES,
  PHARMABEES,
  SILVERBEES,
  TNIDETF
};
const includeList = ['NIFTYBEES', 'BANKBEES', 'AUTOBEES', 'ITBEES', 'MID150BEES', 'SMALLCAP', 'SHARIABEES','PHARMABEES', 'MAKEINDIA','TNIDETF']
//const includeList = ['NIFTYBEES']

export default {
  async mounted() {
    this.$nextTick(() => {
      const firstCol = document.querySelector('.first-col');
      if (firstCol) {
        const width = firstCol.offsetWidth;
        document.documentElement.style.setProperty('--first-col-width', `${width}px`);
      }
    });
    try {
      const resp = await api.get("/api/nse/instruments");
      this.etfList = resp.data.filter(_ => includeList.indexOf(_.symbol) > -1);
      for (const etf of this.etfList) {
        if (includeList.indexOf(etf.symbol) == -1) continue;
        const etfData = etfImports[etf.symbol];
        this.market[etf.symbol] = etfData.map((_) => {
          const dateToks = _.date.split("-");
          return {
            date: new Date(dateToks[2], dateToks[1] * 1 - 1, dateToks[0]),
            deltaPercent: parseFloat(_.change),
            price: parseFloat(_.price.replace(',', '')),
          };
        });
      }
      console.log(this.market['NIFTYBEES'])
      this.updateInvestments()
    } catch (e) {
      console.log(e);
    }
  },
  components: {InvestmentChart},
  methods: {
    updateInvestments(){
      this.base_amt =  this.base_amtShort.substring(0, this.base_amtShort.length - 2) * 1000;
      
      Object.keys(this.market).forEach(_ => {
        this.investments[_] = {}
        this.totalUnitsBought[_] = {}
        this.totalInvestment[_] = {}
        this.currentValue[_] = {}
        this.totalUnitsBought[_] = {}
        this.returnsFromInvestment[_] = {}
        this.showChart[_] = false
        this.makeInvestment(_, true);
        this.makeInvestment(_, false);
      })
    },
    incrementTrigger() {
      if (this.buy_factor < 2) this.buy_factor += 0.01;
      this.updateInvestments();
    },
    decrementTrigger() {
      if (this.buy_factor > 1) this.buy_factor -= 0.01;
      this.updateInvestments();
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
    filterMonthlyData(data, pickLastDay = false) {
    // Create a Map to store entries for each month
    const monthlyData = new Map();
    
    // Sort the data by date in ascending order
    const sortedData = [...data].sort((a, b) => 
        pickLastDay ? b.date - a.date : a.date - b.date
    );
    
    // Iterate through the sorted data
    sortedData.forEach(entry => {
        // Create a key in format 'YYYY-MM' for each date
        const monthKey = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, '0')}`;
        
        // Only add the entry if we haven't seen this month yet
        if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, entry);
        }
    });
    
    // Convert the Map values back to an array and sort by date
    return Array.from(monthlyData.values())
        .sort((a, b) => a.date - b.date);
},
    getCandidates(etfSymbol, isDipSip){
      return (isDipSip == true) ? this.market[etfSymbol].filter((m) => m.deltaPercent <= this.trigger * -1) : 
      this.filterMonthlyData(this.market[etfSymbol], true) 
    },
    makeInvestment(etfSymbol, isDipSip) {
      this.investments[etfSymbol][isDipSip] = [];
      const candidates = this.getCandidates(etfSymbol, isDipSip)
      for (const c of candidates) {
        const investedAmt = isDipSip ? Math.round(
          this.base_amt *
            Math.pow(
              this.buy_factor,
              Math.abs(c.deltaPercent) * 1 - this.trigger * 1
            )
        ) : this.totalInvestment[etfSymbol][true]/72;
        const unitsBought = investedAmt / c.price;
        c.unitsBought = unitsBought;
        c.investedAmt = investedAmt;
        this.investments[etfSymbol][isDipSip].push({
          investmentAmount: investedAmt,
          unitsBought,
          price: c.price,
          investmentDate: c.date,
          correction: c.deltaPercent,
        });
      }
      this.totalUnitsBought[etfSymbol][isDipSip] = candidates.reduce(
        (acc, c) => acc + c.unitsBought * 1,
        0
      );
      this.totalInvestment[etfSymbol][isDipSip] = candidates.reduce(
        (acc, c) => acc + c.investedAmt * 1,
        0
      );
      this.currentValue[etfSymbol][isDipSip] = this.totalUnitsBought[etfSymbol][isDipSip] * this.market[etfSymbol][0].price;
      
      this.returnsFromInvestment[etfSymbol][isDipSip] = this.xirr(
        this.investments[etfSymbol][isDipSip].map((i) => i.investmentAmount * -1),
        this.investments[etfSymbol][isDipSip].map((i) => i.investmentDate),
        0.12,
        this.currentValue[etfSymbol][isDipSip],
        this.market[etfSymbol][0].date
      );
    },
  },
  data() {
    return {
      etfList: [],
      market: {},
      investments: [],
      totalInvestment: {},
      totalUnitsBought: {},
      lastDate: {},
      currentValue: {},
      returnsFromInvestment: {},
      buy_factor: 1.33,
      base_amtShort: "10 k",
      base_amt: 10000,
      trigger: 2.0,
      tooltip_baseAmt:
        "Base Amount (think SIP amount), on which the Allocation Factor is applied. Each investment is therefore small, and relatively low risk, but staggered trades over long periods of time add up to big compounding corpus.",
      tooltip_trigger:
        "You invest when your index falls more than this percentage",
      tooltip_buy_factor:
        "Allocation Factor: A function, that increases allocation as the specific index correction increases. Factor of 1 means constant base amount, irrespective of correction severity. Factor of 2 (most aggressive) means investment amount doubles on every 1 % correction.",

      showChart : {},

// Sample data for testing
    priceData : [
  { date: '2024-12-31', price: '22,834.00', change: '0.29%' },
  { date: '2024-12-30', price: '22,768.25', change: '-1.43%' }
  ],

  strategy1Data : [
  {
    investmentAmount: 10029,
    unitsBought: 589.94,
    price: 17,
    investmentDate: '2024-12-20',
    correction: -2.01
  },
  {
    investmentAmount: 13530,
    unitsBought: 845.63,
    price: 16,
    investmentDate: '2024-11-13',
    correction: -3.06
  }
],

strategy2Data :[
  {
    investmentAmount: 18119.42,
    unitsBought: 3623.88,
    price: 5,
    investmentDate: '2019-01-31',
    correction: 0.55
  },
  {
    investmentAmount: 18119.42,
    unitsBought: 4529.85,
    price: 4,
    investmentDate: '2019-02-28',
    correction: 0.86
  }
]
      
    };
  },
  
};
</script>
<style>
.table-wrapper {
  position: relative;
  overflow-x: auto;
  overflow-y: visible;
  width: 100%;
}

.sticky-col {
  position: sticky;
  background: white; /* Match your table background */
  z-index: 1;
}

.first-col {
  left: 0;
  z-index: 2;
}

.second-col {
  left: var(--first-col-width); /* Will be set by JavaScript */
  z-index: 2;
}
.text-nowrap {
  white-space: nowrap;
}
.responsive-table {
  /* Subtract approximate heights of other elements */
  height: calc(
    100vh - 200px
  ) !important; /* Adjust 200px based on your header/footer heights */
  max-height: calc(100vh - 200px) !important;
}

/* Add media query for mobile devices */
@media screen and (max-width: 600px) {
  .responsive-table {
    height: calc(100vh - 250px) !important; /* Adjust for mobile */
    max-height: calc(100vh - 250px) !important;
  }
}
.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  margin-bottom: 1rem;
}

/* Custom scrollbar styling */
.table-container::-webkit-scrollbar {
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
/* Add box shadow for better visual separation */
.sticky-col::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0));
  pointer-events: none;
}
</style>