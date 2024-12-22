<template>
  <div>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" md="10" lg="12"> 
            <v-card class="pb-2" color="primary" theme="light" :max-width="$vuetify.display.mdAndDown ? '380px' : '100%'">
            <v-card-title>ETFs</v-card-title>
            <v-card-subtitle>Curated from universe of ~225 ETFs</v-card-subtitle>
            <v-table
              density="compact"
              theme="light"
              class="ml-2 mr-2 responsive-table"
              fixed-header
            >
              <thead>
                <tr>
                  <th class="text-left">Code</th>
                  <th class="text-left">Underlying</th>
                  <th class="text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in etfList" :key="item.symbol">
                  <td>{{ item.symbol }}</td>
                  <td>{{ item.underlying }}</td>
                  <td>{{ item.description }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import api from "./api";

export default {
    async mounted(){
        try{
        const resp = await api.get('/api/nse/instruments')
        console.log(resp)
        this.etfList = resp.data
        console.log(this.etfList)
      }
      catch(e){
        console.log(e)
      }
    },
    data(){
        return {
            etfList: []
        }
    }
}
</script>
<style>
.responsive-table {
  /* Subtract approximate heights of other elements */
  height: calc(100vh - 200px) !important; /* Adjust 200px based on your header/footer heights */
  max-height: calc(100vh - 200px) !important;
}

/* Add media query for mobile devices */
@media screen and (max-width: 600px) {
  .responsive-table {
    height: calc(100vh - 250px) !important; /* Adjust for mobile */
    max-height: calc(100vh - 250px) !important;
  }
}
</style>