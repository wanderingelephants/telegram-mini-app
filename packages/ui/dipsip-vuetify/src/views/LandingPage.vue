<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <v-card elevation="6" class=" text-center">
          <v-card-title class="text-h5 mb-3">
            DipSip ETFs
          </v-card-title>
          
          <v-card-text>
            <p class="text-body-1">
              Maximize Returns, Minimize Risks.
            </p>
          </v-card-text>
          
          <v-card-actions class="justify-center">
            <v-btn 
              color="primary" 
              variant="elevated" 
              to="/dipsip"
            >
              Subscribe
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card elevation="6" class=" text-center">
          <v-card-title class="text-h5 mb-3">
            Regular SIPs are Bad
          </v-card-title>
          
          <v-card-text>
            <p class="text-body-1">
              They make only Fund Houses rich.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card elevation="6" class=" text-center">
          <v-card-title class="text-h5 mb-3">
            MFs Underperform, are Expensive
          </v-card-title>
          
          <v-card-text>
            <p class="text-body-1">
              ETFs fee is ~0.15 %, MFs is ~1.5 %. Vast majority of MFs underperform.
              <a href="https://economictimes.indiatimes.com/mf/analysis/63-equity-mutual-funds-fail-to-beat-benchmarks-in-3-years/articleshow/112729472.cms" target="_blank">Reference</a>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card elevation="6" class=" text-center">
          <v-card-title class="text-h5 mb-3">
            Wealth Creation
          </v-card-title>
          
          <v-card-text>
            <p class="text-body-1">
              Suitable for people with 3-5 year horizon, and who do not have time to actively monitor/research markets. Learn more under <a href="/principles">Principles</a> section.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Any landing page logic can be added here
</script>

<style scoped>
.v-card {
  max-width: 500px;
  margin: 0 auto;
}
</style>