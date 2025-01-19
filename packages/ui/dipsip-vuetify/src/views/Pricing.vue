<template>
  <v-container class="pricing-container">
    <v-card class="mx-auto my-8 text-center" max-width="600">
      <v-card-title class="text-h4 font-weight-bold justify-center py-4">
        Pricing Plan
      </v-card-title>

      <v-card-text>
        <!-- Pricing Section -->
        <div class="pricing-section mb-6">
          <div class="text-decoration-line-through text-grey">
            <span class="text-h5">₹599</span>/month
          </div>
          <div class="text-h3 primary--text font-weight-bold">
            ₹299<span class="text-h5">/month</span>
          </div>
        </div>

        <!-- Features Section -->
        <v-card-title class="text-h5 justify-center">
          What you get
        </v-card-title>

        <v-list class="transparent">
          <v-list-item v-for="(feature, index) in features" :key="index">
            
            <v-list-item-content>
              <v-list-item-title class="text-left text-wrap">
                {{ feature }}&nbsp;<v-icon color="success">mdi-check-circle</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- Coming Soon Section -->
        <v-alert
          class="mt-6"
          color="info"
          border="left"
          prominent
        >
          <div class="text-h6">Coming Soon!</div>
          <div>Additional Premium Service to track Smart Money movements in individial Stocks</div>
          <div class="font-weight-bold mt-2">Additional ₹499/month</div>
        </v-alert>

        <!-- Subscribe Button -->
        <v-btn
          class="mt-6"
          x-large
          color="primary"
          rounded
          @click="subscribe"
          v-if="false"
        >
          Subscribe Now
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'PricingPage',
  data() {
    return {
      features: [
        'Smart Mutual Fund Analysis',
        'DipSIP alerts',
        'Quarterly Portfolio Health Check-up',
        'Yearly rebalancing recommendations, based on Risk Profile',
        'Research on REITs, InvITs, Crypto',
      ]
    }
  },
  methods: {
    subscribe() {
      // Implement subscription logic here
      console.log('Subscribe clicked')
    }
  }
}
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
.text-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}
.pricing-container {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.pricing-section {
  padding: 1.5rem 0;
}
</style>