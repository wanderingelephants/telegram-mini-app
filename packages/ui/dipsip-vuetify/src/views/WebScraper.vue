<template>
  <v-card class="mx-auto" max-width="800">
    <v-card-title>Browser-based Web Scraper</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="urlList"
            label="URLs (one per line)"
            rows="5"
            placeholder="https://example.com"
          ></v-textarea>
        </v-col>
      </v-row>

      <!-- Proxy settings -->
      <v-row>
        <v-col cols="12" md="6">
          <v-switch v-model="useProxy" label="Use CORS Proxy"></v-switch>
        </v-col>
        <v-col cols="12" md="6" v-if="useProxy">
          <v-text-field
            v-model="proxyUrl"
            label="Proxy URL"
            placeholder="https://cors-anywhere.herokuapp.com/"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-btn
        :loading="isRunning"
        :disabled="!urlList.trim()"
        color="primary"
        @click="startScraping"
        class="mb-4"
      >
        {{ isRunning ? "Scraping..." : "Start Scraping" }}
      </v-btn>

      <v-progress-linear v-if="isRunning" v-model="progress" height="25">
        <template v-slot:default> {{ Math.ceil(progress) }}% </template>
      </v-progress-linear>

      <!-- Results -->
      <v-expansion-panels v-if="results.length">
        <v-expansion-panel v-for="(result, index) in results" :key="index">
          <v-expansion-panel-header>
            <v-row no-gutters>
              <v-col cols="10">{{ result.url }}</v-col>
              <v-col cols="2" class="text-right">
                <v-icon :color="result.success ? 'success' : 'error'">
                  {{ result.success ? "mdi-check" : "mdi-alert" }}
                </v-icon>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <template v-if="result.success">
              <div v-if="result.title" class="mb-2">
                <strong>Title:</strong> {{ result.title }}
              </div>
              <div v-if="result.links?.length">
                <strong>Links found:</strong> {{ result.links.length }}
                <v-list dense>
                  <v-list-item
                    v-for="(link, i) in result.links.slice(0, 5)"
                    :key="i"
                  >
                    {{ link }}
                  </v-list-item>
                </v-list>
              </div>
            </template>
            <div v-else class="error--text">Error: {{ result.error }}</div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "WebScraper",

  data() {
    return {
      urlList: "",
      results: [],
      isRunning: false,
      progress: 0,
      useProxy: false,
      proxyUrl: "https://cors-anywhere.herokuapp.com/",
    };
  },

  methods: {
    async scrapeUrl(url) {
      try {
        const finalUrl = this.useProxy ? `${this.proxyUrl}${url}` : url;

        const response = await fetch(finalUrl, {
          headers: {
            "User-Agent": navigator.userAgent,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            Origin: window.location.origin,
            // Add proxy-specific headers if needed
            ...(this.useProxy && { "X-Requested-With": "XMLHttpRequest" }),
          },
          credentials: "omit", // Important for CORS
          referrerPolicy: "no-referrer",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const text = await response.text();
        const parser = new DOMParser();
        const document = parser.parseFromString(text, "text/html");

        const dateSpan = document.querySelector("h2.title_24px span.subtext");
        const dateText = dateSpan ? dateSpan.textContent : null;
        console.log("Portfolio Holding Date", dateText);
        const table = document.querySelector('#equityCompleteHoldingTable');
        console.log("table", table)
            if (!table) return null;

            // Get headers
            const headers = Array.from(table.querySelectorAll('thead th'))
                .map(th => th.textContent.trim());

            // Get holdings
            const holdings = Array.from(table.querySelectorAll('tbody tr'))
                .map(row => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    const holding = {};
                    headers.forEach((header, index) => {
                        if (cells[index]) {
                            if (index === 0) { // Special handling for first column "Stock Invested in"
                                // Get the stock name from the second span (port_right) containing the actual link
                                const stockNameElement = cells[index].querySelector('span.port_right a');
                                if (stockNameElement) {
                                    const stockName = stockNameElement.textContent.trim();
                                    if (stockName === 'No group') {
                                        return null; // Skip this row entirely
                                    }
                                    holding[header] = stockName;
                                } else {
                                    return null; // Skip if we can't find the stock name
                                }
                            } else {
                                holding[header] = cells[index].textContent.trim();
                            }
                        }
                    });
                    return holding;
                })
                .filter(holding => holding !== null)
        console.log(holdings)        
        return {
          url,
          success: true,
          title: document.querySelector("title")?.textContent,
          links: Array.from(doc.querySelectorAll("a"))
            .map((a) => a.href)
            .filter((href) => href && !href.startsWith("javascript:")),
        };
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return {
          url,
          success: false,
          error: error.message,
        };
      }
    },

    async startScraping() {
      this.isRunning = true;
      this.results = [];
      this.progress = 0;

      const urls = this.urlList
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url && url.startsWith("http"));

      for (let i = 0; i < urls.length; i++) {
        const result = await this.scrapeUrl(urls[i]);
        this.results.push(result);
        this.progress = ((i + 1) / urls.length) * 100;

        // Add delay to avoid overwhelming servers
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      this.isRunning = false;
    },
  },
};
</script>