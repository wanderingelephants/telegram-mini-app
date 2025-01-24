<template>
  <v-card class="ma-4">
    <v-card-title>Mutual Fund Scraper</v-card-title>
    
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="mf_category_selected"
            :items="mutual_fund_categories"
            label="Select Category"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="mf_scheme_code"
            label="Scheme Code"
            placeholder="Enter scheme code or 'All'"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="delay"
            type="number"
            label="Delay between requests (ms)"
            hint="Recommended: 2000-5000ms"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-btn
        :loading="isProcessing"
        color="primary"
        @click="startScraping"
        class="mt-4 mr-2"
      >
        {{ isProcessing ? 'Processing...' : 'Start Scraping' }}
      </v-btn>
      
      <v-btn
        v-if="isProcessing"
        color="error"
        @click="stopProcessing = true"
        class="mt-4"
      >
        Stop Processing
      </v-btn>

      <v-progress-linear
        v-if="isProcessing"
        v-model="progress"
        class="mt-4"
      ></v-progress-linear>

      <!-- Results -->
      <v-expansion-panels class="mt-4">
        <v-expansion-panel v-for="(category, index) in processedResults" :key="index">
          <v-expansion-panel-header>
            {{ category.name }} ({{ category.funds.length }} funds)
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :headers="tableHeaders"
              :items="category.funds"
              :items-per-page="10"
              class="elevation-1"
            ></v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import api from './api'
export default {
  name: 'MutualFundScraper',
  
  data() {
    return {
      base_url: 'https://www.moneycontrol.com',
      mutual_fund_categories: ['All', 'aggressive-hybrid-fund','arbitrage-fund','childrens-fund','conservative-hybrid-fund','contra-fund','dividend-yield-fund','dynamic-asset-allocation-or-balanced-advantage','elss-tax-saving-schemes','equity-savings','etfs','flexi-cap-fund','focused-fund','fund-of-funds','funds_category.txt','hybrid-aggressive','index-fundsetfs','investment-cum-insurance','large-and-mid-cap-fund','large-cap-fund','mid-cap-fund','multi-asset-allocation','multi-cap-fund','retirement-fund','sectoralthematic','small-cap-fund','value-fund'],
      mf_category_selected: 'childrens-fund',
      mf_scheme_code: '',
      delay: 3000,
      isProcessing: false,
      stopProcessing: false,
      progress: 0,
      processedResults: [],
      tableHeaders: [
        { text: 'Fund Name', value: 'name' },
         { text: 'Fund Code', value: 'schemeCode' },
        { text: 'Expenses Ratio', value: 'expensesRatio' },
        { text: 'Category Average', value: 'expensesRatioCategoryAverage' }
      ]
    }
  },

  methods: {
    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    get_category_url(mf_category) {
      return `${this.base_url}/mutual-funds/performance-tracker/returns/${mf_category}.html`;
    },

    async fetchWithRetry(url, retries = 3) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': navigator.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
          }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const text = await response.text();
        return new DOMParser().parseFromString(text, 'text/html');
      } catch (error) {
        if (retries > 0) {
          await this.sleep(this.delay);
          return this.fetchWithRetry(url, retries - 1);
        }
        throw error;
      }
    },

    async get_funds_for_category_url(mf_category_url, inputSchemeCodes) {
        console.log(new Date(), "inputSchemeCodes", inputSchemeCodes)
      const document = await this.fetchWithRetry(mf_category_url);
      const headerRow = document.querySelector('table thead tr');
            const columnIndices = {};
            
            if (headerRow) {
                const headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());
                columnIndices.name = headers.findIndex(h => h.includes('Scheme Name'));
                columnIndices.plan = headers.findIndex(h => h.includes('Plan'));
                columnIndices.category = headers.findIndex(h => h.includes('Category Name'));
                columnIndices.rating = headers.findIndex(h => h.includes('Crisil Rating'));
                columnIndices.aum = headers.findIndex(h => h.includes('AuM'));
                columnIndices.returns = {
                    '1W': headers.findIndex(h => h === '1W'),
                    '1M': headers.findIndex(h => h === '1M'),
                    '3M': headers.findIndex(h => h === '3M'),
                    '6M': headers.findIndex(h => h === '6M'),
                    'YTD': headers.findIndex(h => h === 'YTD'),
                    '1Y': headers.findIndex(h => h === '1Y'),
                    '2Y': headers.findIndex(h => h === '2Y'),
                    '3Y': headers.findIndex(h => h === '3Y'),
                    '5Y': headers.findIndex(h => h === '5Y'),
                    '10Y': headers.findIndex(h => h === '10Y')
                };
            }

            const funds = [];
            const rows = document.querySelectorAll('table tbody tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 1) {
                    const link = cells[columnIndices.name]?.querySelector('a');
                    if (link) {
                        const url = link.href;
                        console.log("url", url)
                        // Skip ad clicks and non-mutual fund URLs
                        if (url.includes('Click_Tracker') || 
                            url.includes('doubleclick') || 
                            !url.includes('moneycontrol.com/mutual-funds/')) {
                            return;
                        }

                        const name = link.textContent.trim();
                        
                        // Skip entries with suspicious names
                        if (name.toLowerCase().includes('invest now') ||
                            name.toLowerCase().includes('advertisement')) {
                            return;
                        }

                        // Extract scheme code and validate it
                        const schemeCode = url.split('/').pop();
                        console.log("schemeCode", schemeCode)
                        if (!schemeCode || schemeCode.includes('?') || schemeCode === 'MC_Click_Tracker') {
                            return;
                        }

                        // Get category from URL and validate
                        const urlParts = url.split('/');
                        const urlCategory = urlParts.length >= 5 ? urlParts[4] : '';
                        if (!urlCategory || urlCategory.includes('?') || urlCategory.includes('clk')) {
                            return;
                        }

                        // Collect all return periods
                        const returns = {};
                        Object.entries(columnIndices.returns).forEach(([period, index]) => {
                            if (index !== -1 && cells[index]) {
                                returns[period] = cells[index].textContent.trim();
                            }
                        });
                        console.log(schemeCode, inputSchemeCodes.findIndex(_ => _ === schemeCode))
                        if (inputSchemeCodes.length==0 || inputSchemeCodes.findIndex(_ => _ === schemeCode) > -1)
                        funds.push({
                            name,
                            url,
                            schemeCode,
                            urlCategory,
                            plan: columnIndices.plan !== -1 ? cells[columnIndices.plan]?.textContent.trim() : '',
                            category: columnIndices.category !== -1 ? cells[columnIndices.category]?.textContent.trim() : '',
                            rating: columnIndices.rating !== -1 ? cells[columnIndices.rating]?.textContent.trim() : '',
                            aum: columnIndices.aum !== -1 ? cells[columnIndices.aum]?.textContent.trim() : '',
                            returns
                        });
                    }
                }
            });
      return funds;
    },
    parseHoldingsDate(dateText) {
    const monthMap = {'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 
        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'}
    // Extract date from format "as on 30th Nov,2024" to "30-Nov-2024"
    const match = dateText.match(/(\d{1,2})[a-z]{2}\s+([A-Za-z]+),(\d{4})/);
    if (match) {
        const [_, day, month, year] = match;
        return `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
    }
    return null;    
    },

    async processFundDetails(fund) {
      const doc = await this.fetchWithRetry(fund.url);
      
      // Extract expenses ratio
      const expensesRatioElement = doc.querySelector('#mc_content > div > section.clearfix.section_one > div > div.common_left > div:nth-child(3) > div.right_section > div.top_section > table > tbody > tr:nth-child(1) > td:nth-child(2) > span.amt');
      const categoryAverageElement = doc.querySelector('#mc_content > div > section.clearfix.section_one > div > div.common_left > div:nth-child(3) > div.right_section > div.top_section > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.grayvalue');

      fund.expensesRatio = expensesRatioElement?.textContent.trim() || 'N/A';
      fund.expensesRatioCategoryAverage = categoryAverageElement?.textContent.trim() || 'N/A';

      // Get portfolio URL and fetch holdings
      const baseUrl = fund.url.replace('-growth', '').replace('/nav/', '/');
      const lastSlashIndex = baseUrl.lastIndexOf('/');
      const portfolioUrl = baseUrl.slice(0, lastSlashIndex) + '/portfolio-holdings' + baseUrl.slice(lastSlashIndex);
      
      await this.sleep(this.delay);
      const portfolioDoc = await this.fetchWithRetry(portfolioUrl);
      const dateSpan = document.querySelector('h2.title_24px span.subtext');
      const holdingsDateSpan  = dateSpan ? dateSpan.textContent : null;
      let holdingsDateText = holdingsDateSpan == null ? '1970-01-01' : this.parseHoldingsDate(holdingsDateSpan)
      fund.reportingDate = holdingsDateText
      const table = portfolioDoc.querySelector('#equityCompleteHoldingTable');
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
                .filter(holding => holding !== null);
            fund.holdings = holdings
      return fund;
    },

    async processCategory(category, mf_scheme_code) {
      this.stopProcessing = false;
      const categoryUrl = this.get_category_url(category);
      let funds;
      (mf_scheme_code === "" || mf_scheme_code === "All") ? 
        funds = await this.get_funds_for_category_url(categoryUrl, []):
        funds = await this.get_funds_for_category_url(categoryUrl, mf_scheme_code.split(",").map(item => item.trim()))
      
      for (let i = 0; i < funds.length && !this.stopProcessing; i++) {
            await this.sleep(this.delay);
            funds[i] = await this.processFundDetails(funds[i]);
            this.progress = (i + 1) / funds.length * 100;
            if (funds[i] !== null){
                await api.post('/api/mutualfunds/categoryScrape', {
                "categoryKey": category,
                "funds": [funds[i]]
                })
            }
      }
      funds = funds.filter(f => f != null)
      
      
      return {
        name: category,
        funds: funds
      };
    },

    async startScraping() {
      this.isProcessing = true;
      this.processedResults = [];
      this.progress = 0;

      try {
        const categoriesToProcess = this.mf_category_selected === 'All' 
          ? this.mutual_fund_categories.filter(cat => cat !== 'All')
          : [this.mf_category_selected];

        for (const category of categoriesToProcess) {
          if (this.stopProcessing) break;
          const result = await this.processCategory(category, this.mf_scheme_code);
          this.processedResults.push(result);
        }
      } catch (error) {
        console.error('Scraping error:', error);
      } finally {
        this.isProcessing = false;
      }
    }
  }
}
</script>