<template>
  <div class="data-explorer-grid-container">
    <!-- Search Bar -->
    <v-card class="mb-4">
      <v-card-text>
        <v-autocomplete
          v-model="selectedPromptId"
          :items="promptItems"
          :loading="loading"
          item-title="title"
          item-value="id"
          label="Search saved prompts"
          placeholder="Select a saved prompt"
          return-object
          variant="outlined"
          hide-details
          clearable
          @update:model-value="handlePromptSelection"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                {{ loading ? 'Loading prompts...' : 'No saved prompts found' }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-card-text>
    </v-card>

    <!-- Prompt Details and Results -->
    <v-card v-if="selectedPrompt">
      <v-card-text>
        <div class="text-body-1 mb-4">{{ selectedPrompt.textContent_user_query }}</div>
        
        <v-row class="my-2">
          <v-col>
            <v-btn 
              color="primary" 
              @click="runSavedPrompt(selectedPrompt.chat_uuid, selectedPrompt.id)"
              :loading="runningPrompt"
            >
              Run
            </v-btn>
            <v-btn 
              color="secondary" 
              class="ml-2" 
              @click="showScheduleDialog = true"
            >
              Schedule
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Results Section -->
        <v-expand-transition>
          <div v-if="promptResults.length > 0" class="results-section mt-4">
            <v-divider class="mb-4"></v-divider>
            <h3 class="text-h6 mb-3">Results</h3>
            
            <div class="table-container">
              <v-data-table
                :headers="tableHeaders"
                :items="promptResults"
                :items-per-page="5"
                :footer-props="{
                  'items-per-page-options': [5, 10, 20, -1],
                }"
                class="elevation-1"
                density="compact"
              ></v-data-table>
            </div>
          </div>
        </v-expand-transition>
        
        <v-alert
          v-if="hasRunQuery && promptResults.length === 0"
          type="info"
          class="mt-4"
          density="compact"
        >
          No data available for this query.
        </v-alert>
      </v-card-text>
    </v-card>
    
    <v-card v-else class="placeholder-card">
      <v-card-text class="text-center pa-5">
        <v-icon size="48" color="grey lighten-1">mdi-file-document-outline</v-icon>
        <div class="text-h6 mt-3">Select a saved prompt to view details</div>
        <div class="text-body-2 text-grey">
          Use the search bar above to find your saved prompts
        </div>
      </v-card-text>
    </v-card>
    
    <!-- Schedule Dialog -->
    <v-dialog v-model="showScheduleDialog" max-width="500px">
      <v-card>
        <v-card-title>Schedule Prompt Run</v-card-title>
        <v-card-text>
          <v-form ref="scheduleForm">
            <v-select
              v-model="scheduleFrequency"
              :items="['Daily', 'Weekly', 'Monthly']"
              label="Frequency"
              required
            ></v-select>
            
            <v-select
              v-if="scheduleFrequency === 'Weekly'"
              v-model="scheduleDayOfWeek"
              :items="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
              label="Day of Week"
              required
            ></v-select>
            
            <v-text-field
              v-if="scheduleFrequency === 'Monthly'"
              v-model="scheduleDayOfMonth"
              label="Day of Month"
              type="number"
              min="1"
              max="31"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="scheduleTime"
              label="Time (HH:MM)"
              placeholder="13:00"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="showScheduleDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="schedulePrompt">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {
  USER_SAVED_PROMPTS
} from "../lib/helper/queries";

export default {
  name: 'SavedPrompts',
  props: {
    userEmail: {
      type: String,
      required: true
    }
  },
  
  data() {
    return {
      loading: false,
      savedPrompts: [],
      selectedPromptId: null,
      selectedPrompt: null,
      promptResults: [],
      tableHeaders: [],
      hasRunQuery: false,
      runningPrompt: false,
      
      // Schedule dialog
      showScheduleDialog: false,
      scheduleFrequency: 'Daily',
      scheduleDayOfWeek: 'Monday',
      scheduleDayOfMonth: 1,
      scheduleTime: '09:00',
      
      // Snackbar
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      }
    };
  },
  computed: {
    promptItems() {
      return this.savedPrompts.map(prompt => ({
        id: prompt.id,
        title: prompt.chat_title,
        uuid: prompt.chat_uuid,
        prompt: prompt
      }));
    }
  },
  mounted() {
    this.getUserChatHistory();
  },
  methods: {
    async getUserChatHistory() {
      this.loading = true;
      try {
        const chatQueryResponse = await this.$apollo.query({
          query: USER_SAVED_PROMPTS,
          variables: { email: this.userEmail },
          fetchPolicy: "no-cache"
        });
        
        this.savedPrompts = chatQueryResponse.data.user_chat || [];
      } catch (error) {
        console.error('Error fetching saved prompts:', error);
        this.snackbar.color = 'error';
        this.snackbar.message = 'Failed to load saved prompts';
        this.snackbar.show = true;
      } finally {
        this.loading = false;
      }
    },
    
    handlePromptSelection(selection) {
      if (selection) {
        // Find the full prompt object
        this.selectedPrompt = this.savedPrompts.find(p => p.id === selection.id);
        
        // Reset results when changing prompts
        this.promptResults = [];
        this.tableHeaders = [];
        this.hasRunQuery = false;
      } else {
        this.selectedPrompt = null;
      }
    },
    
    async runSavedPrompt(chat_uuid, chat_id) {
      this.runningPrompt = true;
      this.hasRunQuery = true;
      
      try {
        const response = await fetch("/api/chat/runPrompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtGoogle")}`,
          },
          body: JSON.stringify({
            chat_id: chat_id,
            chat_uuid: chat_uuid,
            email: this.userEmail
          }),
        });
        
        if (response.status !== 200) {
          this.snackbar.color = "error";
          this.snackbar.message = "Not authorized";
          this.snackbar.show = true;
          return;
        }
        
        const data = await response.json();
        this.processResults(data);
        
        this.snackbar.color = "success";
        this.snackbar.message = "Prompt executed successfully";
        this.snackbar.show = true;
      } catch (error) {
        console.error(error);
        this.snackbar.color = "error";
        this.snackbar.message = "Failed to run prompt";
        this.snackbar.show = true;
      } finally {
        this.runningPrompt = false;
      }
    },
    
    processResults(data) {
      // Reset results
      this.promptResults = [];
      this.tableHeaders = [];
      
      // Check if data is array and not empty
      if (Array.isArray(data) && data.length > 0) {
        // Use the first row to determine columns
        const firstRow = data[0];
        
        // Generate headers from first row
        this.tableHeaders = Object.keys(firstRow).map(key => ({
          title: this.formatColumnTitle(key),
          key: key,
          sortable: true
        }));
        
        // Set the results
        this.promptResults = data;
        
        // Scroll to results after rendering
        this.$nextTick(() => {
          const resultsElement = document.querySelector('.results-section');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    },
    
    formatColumnTitle(key) {
      // Convert snake_case or camelCase to Title Case
      return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    },
    
    schedulePrompt() {
      // Logic for scheduling would go here
      // This is a placeholder - actual implementation would depend on your backend services
      
      this.snackbar.color = "info";
      this.snackbar.message = "Scheduling functionality would be implemented here";
      this.snackbar.show = true;
      this.showScheduleDialog = false;
    }
  }
};
</script>

<style scoped>
.data-explorer-grid-container {
  width: 100%;
  height: 100%;
}

.placeholder-card {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-section {
  transition: all 0.3s ease;
}

.table-container {
  margin-bottom: 60px; /* Add bottom margin to ensure pagination controls are visible */
  position: relative;
  width: 100%;
}

/* Make sure the table doesn't overflow its container */
.v-data-table {
  width: 100%;
  max-width: 100%;
}
</style>