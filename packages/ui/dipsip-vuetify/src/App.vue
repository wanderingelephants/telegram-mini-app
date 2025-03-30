<template>
  <v-app theme="light">
    <v-navigation-drawer 
      v-model="drawer" 
      temporary 
      location="left"
      mobile-breakpoint="md"
    >
      <v-list>
        <v-list-item 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          @click="drawer = false"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#FFA000">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Menu</v-toolbar-title>
      <!-- Company Search Autocomplete -->
      <!--<v-autocomplete
  v-model="selectedCompany"
  :items="companies"
  :loading="isLoading"
  label="Search companies..."
  density="compact"
  variant="solo"
  hide-details
  return-object
  item-title="name"
  item-value="symbol"
  class="company-search mx-2"
  @update:model-value="navigateToCompany"
  :filter="customFilter"
>
  
</v-autocomplete> -->
      
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
    <v-btn
      class="chat-fab"
      color="secondary"
      icon
      @click="goToChat"
      size="large"
      elevation="4"
      fixed
    >
      <v-icon>$mdiChatProcessing</v-icon>
    </v-btn>
    <v-footer class="bg-grey-darken-4" v-if="false">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" class="text-center mt-4 text-white">
            <div class="text-caption">
              © {{ new Date().getFullYear() }} Aidea Solutions Private Limited. All rights reserved.
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
export default {
  name: 'App',
  /*async mounted(){
    await this.fetchCompanies()
  },*/
  data() {
    return {
      drawer: false,
      isLoading: false,
      selectedCompany: "",
      menuItems: [
        { title: 'Home', path: '/' },
        { title: 'Assistant', path: '/assistant' },
        { title: 'Index Funds', path: '/etfList' },
        { title: 'Mutual Funds', path: '/mutualfunds' },
        { title: 'Watch List', path: '/watchlist' },
        { title: 'DipSip', path: '/dipsip' },
        { title: 'Principles', path: '/principles' },
        { title: 'Risk  Profile', path: '/riskProfile' },
        { title: 'Tools', path: '/tools' },
        //{ title: 'Offerings', path: '/pricing' },
        { title: 'About Us', path: '/about' }
      ],
      companies: [
        /*{ name: 'Apple Inc.', symbol: 'AAPL' },
        { name: 'Microsoft Corporation', symbol: 'MSFT' },
        { name: 'Amazon.com Inc.', symbol: 'AMZN' },
        { name: 'Alphabet Inc.', symbol: 'GOOGL' },
        { name: 'Meta Platforms Inc.', symbol: 'META' },
        { name: 'Tesla Inc.', symbol: 'TSLA' },
        { name: 'NVIDIA Corporation', symbol: 'NVDA' },
        { name: 'Berkshire Hathaway Inc.', symbol: 'BRK.A' },
        { name: 'JPMorgan Chase & Co.', symbol: 'JPM' },
        { name: 'Johnson & Johnson', symbol: 'JNJ' }*/
        // In a real app, you would fetch this data from your API
      ]
    }
  },
  
  methods: {
    goToChat() {
      this.$router.push('/assistant')
    },
    navigateToCompany(company) {
      if (company) {
        // Navigate to the company details page
        this.$router.push(`/company/${company.symbol}`);
        
        // Reset the selection after navigation
        this.$nextTick(() => {
          this.selectedCompany = null;
        });
      }
    },
    customFilter(item, queryText, itemText) {
  if (queryText === '') return true;
  
  const searchText = queryText.toLowerCase();
  const companyName = item.name.toLowerCase();
  const companySymbol = item.symbol.toLowerCase();
  
  return companyName.includes(searchText) || companySymbol.includes(searchText);
  },
    // In a real app, you might want to implement a method to fetch companies
    // either on mounted or as the user types (with debounce)
    /*async fetchCompanies(query) {
      this.isLoading = true;
      try {
        const response = await fetch(`/api/company/list`);
        const data = await response.json();
        this.companies = data;
        
        // For now we're using the static list above
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        this.isLoading = false;
      }
    }*/
  }
}
</script>

<style>
/* Mobile-first responsive styles */
@media (max-width: 600px) {
  .v-container {
    padding: 8px !important;
  }
}

.disclaimer-section {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.v-footer a:hover {
  opacity: 0.8;
}
.chat-fab {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}
</style>