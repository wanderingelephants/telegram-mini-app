<template>
  <v-container fluid>
    <v-card>
      <v-card-title> Company Documents </v-card-title>

      <v-expansion-panels color="white">
        <v-expansion-panel>
          <v-expansion-panel-title>
            {{ chairman_report.year }} Chairman's Report
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-html="chairman_report.report"></div>
          </v-expansion-panel-text>
        </v-expansion-panel>
        
        <v-expansion-panel>
          <v-expansion-panel-title>
            {{ director_report.year }} Director's Report
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-html="director_report.report"></div>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>
            {{ auditor_report.year }} Auditor's Report
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-html="auditor_report.report"></div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        
      </v-expansion-panels>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Documents",
  props: {
    symbol: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(["loggedInGoogle", "userGoogle"]),
  },

  data() {
    return {
      company_data: [],
      auditor_report: {},
      director_report: {},
      chairman_report: {},
      snackbar: {
        show: false,
        message: "",
        timeout: 3000,
        color: "orange",
      },
    };
  },
  methods: {
    async getCompanyData() {
      try {
        const response = await fetch(
          `/api/company/details/${this.symbol}/${this.entity}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtGoogle")}`,
            },
          }
        );

        if (response.status !== 200) {
          this.snackbar.color = "error";
          this.snackbar.message = "Not authorized";
          this.snackbar.show = true;
          return;
        }

        const jsonData = await response.json();
        console.log("jsonData", jsonData)
        this.company_data = jsonData.company_master[0];
        if (this.company_data["company_auditor_s_report"].length > 0)
        this.auditor_report = this.company_data["company_auditor_s_report"][0]
        if (this.company_data["company_director_s_report"].length > 0)
        this.director_report = this.company_data["company_director_s_report"][0]
        if (this.company_data["company_chairman_s_report"].length > 0)
        this.chairman_report = this.company_data["company_chairman_s_report"][0]
      } catch (e) {
        console.error(e);
        this.snackbar.color = "error";
        this.snackbar.message = "Error fetching data";
        this.snackbar.show = true;
      }
    },
  },
  watch: {
    symbol: async function (newSymbol) {
      await this.getCompanyData();
    },
  },
};
</script>