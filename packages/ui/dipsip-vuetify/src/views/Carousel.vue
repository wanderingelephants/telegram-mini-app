<!-- WealthLandingPage.vue -->
<template>
  <v-app>
    <!-- Header -->
    <v-app-bar
      color="white"
      elevation="1"
    >
      <v-app-bar-title class="text-amber-darken-2 text-h5 font-weight-bold">
        DipSIP
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <!-- Hero Section -->
      <v-container class="py-8">
        <v-row justify="center" align="center">
          <v-col cols="12" class="text-center">
            <p class="text-h6 text-grey-darken-1">
              Your Toolkit to create Generational Wealth
            </p>
          </v-col>
        </v-row>

        <!-- Carousel Section -->
        <v-row class="mt-8">
          <v-col cols="12">
            <v-carousel
              v-model="currentSlide"
              :show-arrows="true"
              hide-delimiter-background
              delimiter-icon="mdi-circle"
              height="500"
              interval="5000"
              class="wealth-carousel"
            >
              <v-carousel-item
                v-for="(card, index) in cards"
                :key="index"
                transition="fade-transition"
                reverse-transition="fade-transition"
                class="wealth-carousel"
              >
                <v-card
                  class="mx-auto wealth-card"
                  max-width="600"
                  elevation="4"
                >
                  <v-card-item class="text-center">
                    <div class="d-flex justify-center mb-6">
                      <v-avatar size="150">
                      <v-img
                        alt="DipSip"
                        src="/DipSIP.jpg"
                      ></v-img>
                      </v-avatar>
                    </div>
                    
                    <v-card-subtitle class="text-h6 text-amber-darken-2 mb-2">
                      {{ card.subtitle }}
                    </v-card-subtitle>
                    
                    <v-card-text 
  class="text-grey-darken-1 text-body-1" 
  v-if="!card.hasHtml"
>
  {{ card.description }}
</v-card-text>
<v-card-text 
  class="text-grey-darken-1 text-body-1" 
  v-else
  v-html="card.description"
>
</v-card-text>

                  </v-card-item>
                </v-card>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8">
            <p class="text-caption text-center">
              Any information on this website does not constitute as investment advice, and must be treated as general information for educational purposes only. Investment in securities market are subject to market risks, read all the related documents carefully before investing.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

// Carousel current slide state
const currentSlide = ref(0)

// Card data
const cards = ref([
  {
    title: "",
    subtitle: "Mutual Fund Sahi Hai ??",
    description: "MFs vastly underperform the market, and charge hefty fees. You can do much better, yourself. See <a href='/etfList'>ETFs</a>.",
    hasHtml: true
  },
  {
    title: "",
    subtitle: "ETF >> MF",
    description: "ETFs are ~10 times lower cost, and majority MFs do not even beat the indexes.",
    hasHtml: false
  },
  {
    title: "",
    subtitle: "ETF >> MF",
    description: "ETFs can be traded. MFs cannot be traded. Buy Aggressively, on Index Dips <a href='/dipsip'>DipSIP</a>",
    hasHtml: true
  },
  {
    title: "",
    subtitle: "DipSIP ETF >>>> MF SIP",
    description: "Do you regret Buying at highs ? Try DipSip, the proven Contra strategy.<a href='/etfList'>DipSIP ETFs</a>",
    hasHtml: true
  },
  {
    title: "Risk Profile",
    subtitle: "Risk Profile",
    description: "Accurately assess your risk profile and allocate judiciously. Then let compounding do its magic. See  <a href='/riskProfile'>Risk Profile</a>",
    hasHtml: true
  },
  {
    title: "Ready",
    subtitle: "Volatility is a Feature, Not a Bug",
    description: "Not many may remember 2024 Election Day counting day dip. DipSip makes sense.<a href='/dipsip'>DipSip</a>.",
    hasHtml: true
  },
  {
    title: "Mutual Funds",
    subtitle: "Portfolio Cleanup",
    description: "Do you have more than 3-4 Mutual Funds ? Chances are there is massive overlap. MF Portfolios need regular checkups <a href='/mutualfunds'>Mutual Fund Overlaps</a>.",
    hasHtml: true
  }
])
</script>

<!-- Only modifying the styles section, rest remains exactly the same -->
<style scoped>
.wealth-carousel {
  background: transparent;
}

.wealth-card {
  padding: 2rem;
  background: white;
  border-radius: 16px;
}

.wealth-icon {
  border: 2px solid rgba(255, 193, 7, 0.2);
}

/* Custom transitions for carousel */
.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 0.5s ease;
}

.fade-transition-enter-from,
.fade-transition-leave-to {
  opacity: 0;
}

/* Carousel dots styling */
:deep(.v-carousel__controls__item) {
  color: transparent !important;
  border: 2px solid black;
  border-radius: 50%;
}

:deep(.v-carousel__controls__item .v-btn__overlay) {
  display: none;
}

/* Active dot with correct class selector */
:deep(.v-carousel__controls__item.v-btn--active) {
  color: black !important;
  background-color: black;
}

/* Hide navigation buttons */
/*:deep(.v-window__left),
:deep(.v-window__right) {
  display: none !important;
}*/
.wealth-carousel :deep(.v-carousel__controls) {
  top: 0;
  bottom: unset;
  
  padding: 8px;
}
</style>