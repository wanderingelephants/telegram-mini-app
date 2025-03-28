<template>
  <div class="stock-screener">
    <google-sign-in />
    <!-- Sticky tabs container positioned below the app bar -->
    <div class="sticky-header">
      <v-tabs 
        v-model="selectedTab" 
        bg-color="white"
        density="comfortable"
        @update:model-value="scrollToSection">
        <v-tab v-for="tab in baseTabs" :key="tab.name" :value="tab.name">
          {{ tab.label }}
        </v-tab>
      </v-tabs>
    </div>
    <div></div>
    <!-- Content sections -->
    <div v-for="tab in baseTabs" :key="tab.name" :id="tab.name" class="section-container">
      <v-card class="mb-6" flat>
        <v-card-title>{{ tab.label }}</v-card-title>
        <v-card-subtitle>All Fields are Promptable in AI Assistant</v-card-subtitle>
        <div>
    <v-icon
      size="small"
      color="grey"
      class="ml-1"
      @click="dialog = true"
    >
      $mdiInformationOutline
    </v-icon>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Prompts Help</v-card-title>
        <v-card-text>
          In your Prompts, you can include any of the financial fields across Balance Sheet, PnL, Cashflow and others, and combine them 
          arbitrarily with any technical or subjective signals. E.g. "Get me companies whose Cash and Cash Equivalents is more than X, and who made announcements related to large order wins in last 15 days. Show me only companies below 5000 Cr marketcap and those who hit 52-Week highs in last 30 days"
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
        <v-card-text>
          <component :is="tab.component" :symbol="symbol" :entity="tab.entity"/>
        </v-card-text>
      </v-card>
    </div>
    <div>
       
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import CompanyDetails from "./CompanyDetails.vue";
//import Chart from "./Chart.vue";
//import Analysis from "./Analysis.vue";
//import Peers from "./Peers.vue";
//import Quarters from "./Quarters.vue";
//import BalanceSheet from "./Financials.vue";
//import CashFlow from "./CashFlow.vue";
//import ProfitLoss from "./ProfitLoss.vue";
import Financials  from "./Financials.vue"
import Ratios from "./Ratios.vue";
import CompanyDocuments from "./CompanyDocuments.vue"
//import Investors from "./Investors.vue";
//import Documents from "./Documents.vue";

export default {
   watch: {
  // Watch for route changes to update the symbol
  '$route.params.symbol'(newSymbol) {
    this.symbol = newSymbol || "";
  }
},
  
  computed: {
  ...mapState([
      "loggedInGoogle",
      "userGoogle",
    ]),
  },
  
  displayTabs() {
    // Create a copy of baseTabs so we don't modify the original
    const tabs = JSON.parse(JSON.stringify(this.baseTabs));
    
    // Update the first tab label to show the symbol if available
    if (this.symbol && tabs.length > 0) {
      tabs[0].label = this.symbol;
    }
    
    return tabs;
  },
  data() {
    return {
      dialog: false,
      selectedTab: "CompanyDetails",
      symbol: "",
      //symbol: this.$route.params.symbol || "",
      baseTabs: [
        { label: "Company", name: "CompanyDetails", component: "CompanyDetails" },
        //{ label: "Chart", component: "Chart" },
        //{ label: "Analysis", component: "Analysis" },
        //{ label: "Peers", component: "Peers" },
        //{ label: "Quarters", component: "Quarters" },
        { label: "Balance Sheet",  name: "BalanceSheet", component: "Financials", entity: "balancesheet" },
        { label: "Cash Flow",  name: "CashFlow", component: "Financials", entity: "cashflow" },
        { label: "Profit & Loss",  name: "PnL", component: "Financials", entity:  "profitloss" },
        { label: "Documents",  name: "Documents", component: "CompanyDocuments", entity:  "documents" },
        //{ label: "Ratios", component: "Ratios" },
        //{ label: "Investors", component: "Investors" },
        //{ label: "Documents", component: "Documents" },
      ],
      isScrolling: false,
      appBarHeight: 64 // Default height, will be measured on mounted
    };
  },
  components: {
    CompanyDetails,
    //Chart,
    //Analysis,
    //Peers,
    //Quarters,
    //ProfitLoss,
    Financials,
    CompanyDocuments,
    //CashFlow,
    Ratios,
    //Investors,
    //Documents,
  },
  async mounted() {
    this.symbol = this.$route.params.symbol 
    // Measure the app bar height
    this.$nextTick(() => {
      const appBar = document.querySelector('.v-app-bar');
      if (appBar) {
        this.appBarHeight = appBar.offsetHeight;
        // Update CSS variable for the app bar height
        document.documentElement.style.setProperty('--app-bar-height', `${this.appBarHeight}px`);
      }
    });
    
    // Add scroll event listener
    window.addEventListener("scroll", this.handleScroll);
    
    // Check for hash in URL and scroll to that section
    this.checkUrlHash();
    
  },
  beforeUnmount() {
    // Remove scroll event listener when component is destroyed
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      // Skip if we're programmatically scrolling
      if (this.isScrolling) return;
      
      // Get all section elements
      const sections = this.baseTabs.map(tab => {
        return {
          id: tab.name,
          element: document.getElementById(tab.name)
        };
      });
      
      // Find which section is most visible in the viewport
      let current = "";
      const totalOffset = this.appBarHeight + 48; // App bar + tabs height
      
      for (const section of sections) {
        if (!section.element) continue;
        
        const sectionTop = section.element.getBoundingClientRect().top;
        
        // If the section top is close to the header bottom or above it
        if (sectionTop <= totalOffset + 50) {
          current = section.id;
        }
      }
      
      // Update selected tab if a section is found
      if (current && current !== this.selectedTab) {
        this.selectedTab = current;
        history.replaceState(null, null, `#${current}`);
      }
    },
    
    scrollToSection(tabComponent) {
      const section = document.getElementById(tabComponent);
      if (!section) return;
      
      this.isScrolling = true;
      
      // Calculate position to scroll to (account for app bar + tabs)
      const tabsHeight = document.querySelector('.sticky-header')?.offsetHeight || 48;
      const totalOffset = this.appBarHeight + tabsHeight;
      
      const topPos = section.getBoundingClientRect().top + window.pageYOffset - totalOffset;
      
      // Smooth scroll to section
      window.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });
      
      // Update URL hash
      history.replaceState(null, null, `#${tabComponent}`);
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        this.isScrolling = false;
      }, 800);
    },
    
    checkUrlHash() {
      const hash = window.location.hash.replace('#', '');
      if (hash && this.baseTabs.some(tab => tab.component === hash)) {
        this.selectedTab = hash;
        this.$nextTick(() => {
          this.scrollToSection(hash);
        });
      }
    }
  }
};
</script>

<style scoped>
/* Ensure the sticky header stays below the app bar */
.sticky-header {
  position: sticky;
  top: var(--app-bar-height, 64px); /* Use CSS variable for app bar height */
  z-index: 99;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Add scroll margin to sections to account for app bar + tabs */
.section-container {
  scroll-margin-top: calc(var(--app-bar-height, 64px) + 48px);
  padding-top: 12px;
  margin-bottom: 20px;
}

/* Ensure tabs have enough space for touch on mobile */
@media (max-width: 600px) {
  .v-tabs {
    overflow-x: auto;
  }
  
  .v-tab {
    padding: 0 12px;
  }
}
</style>