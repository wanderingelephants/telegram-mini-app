<template>
  <div class="chat-wrapper">
    <v-card class="chat-container">
      <!-- Chat Header - Fixed -->
      <div class="chat-header">
        <v-card-title class="primary white--text">
          {{ title }}
        </v-card-title>
        <v-card-subtitle class="subtitle-wrap" v-for="(subTitle, idx) in subTitles" :key="idx">{{ subTitle }}</v-card-subtitle>
      </div>

      <!-- Messages Area - Scrollable -->
      <div class="messages-wrapper" ref="messagesContainer">
        <v-card-text class="chat-messages" >
          <v-list two-line>
            <template v-for="(message, index) in messages" :key="index">
  <v-list-item :class="message.role === 'user' ? 'justify-end' : ''" class="message-item">
    <v-card 
      :class="[
        'message-card',
        message.role === 'user' ? 'user-message' : 'assistant-message'
      ]"
      elevation="0"
    >
      <v-card-title class="text-caption pb-1">
        {{ message.role === 'user' ? 'You' : 'Assistant' }}
      </v-card-title>
      <v-card-text class="white-space-pre pt-0">
        {{ message.content }}
      </v-card-text>
    </v-card>
  </v-list-item>
</template>
            
            <!-- Loading indicator -->
            <v-list-item v-if="isLoading">
              <v-list-item-content class="grey lighten-3 rounded-lg pa-3 ma-2">
                <v-list-item-subtitle>
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="24"
                    class="mr-2"
                  />
                  Fetching Your Response...
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>

      <!-- Input Area - Sticky Bottom -->
      <div class="chat-input">
        <v-card-actions class="pa-4">
          <v-text-field
            ref="chatInput"
            v-model="userInput"
            :label="userInputLabel"
            :disabled="isLoading"
            variant="outlined"
            density="comfortable"
            hide-details
            @keyup.enter="sendMessage"
            append-inner-icon="$send"
            @click:append-inner="sendMessage"
          />
        </v-card-actions>
      </div>
    </v-card>
  </div>
</template>

<script>

export default{
  name: 'PromptChat',
    props:{
        distilledModel: {
            required: true,
            type: String
        },
        title: {
            required: true,
            type: String
        },
        subTitles: {
            required: true,
            type: Array
        },
        userInputLabel: {
            required: true,
            type: String
        },
        debug: {
            required: true,
            type: Boolean,
            default: true
        }
    },
    methods: {
      handleEnter(e) {
   if (this.suggestions.length && this.$refs.autocomplete.isMenuActive) {
     // Let v-autocomplete handle selection
     return;
   }
   this.sendMessage();
 },
        async sendMessage() {
      if (!this.userInput.trim()) return;
      this.suggestions = [];
      const userMessage = {
        role: 'user',
        content: this.userInput.trim()
      };

      // Add user message to chat
      this.messages.push(userMessage);
      this.userInput = '';
      this.isLoading = true;

      try {
	      const response = await fetch('/api/chat/reasoning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        distilledModel: this.distilledModel,
        messages: [...this.messages],
        streaming: true
      })
    });

    // Create reader from response body
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentResponse = '';

    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      // Decode the chunk and split into lines
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(5));
            if (data.error) {
              this.showError = true;
              this.errorMessage = data.error;
              break;
            }


            currentResponse += data.response + '\n';
            // Update the UI with the streaming response
            if (this.messages[this.messages.length - 1]?.role === 'assistant') {
              this.messages[this.messages.length - 1].content = currentResponse;
            } else {
              this.messages.push({
                role: 'assistant',
                content: currentResponse
              });
            }

            if (data.done) {
              break;
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    }


      } catch (error) {
        console.error('Error:', error);
        this.errorMessage = 'Failed to get response from the assistant';
        this.showError = true;
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    onInputChange(text) {
  if (!text) return;
  
  const words = text.split(/\s+/);
  const lastWord = words[words.length - 1].toLowerCase();
  
  let matchedCompanies = []
  if (lastWord.length > 4) {
    matchedCompanies = this.company_names_list
      .filter(name => name.toLowerCase().includes(lastWord));
  }    
    this.suggestions = matchedCompanies.length > 0 ? 
      matchedCompanies.map(name => {
        const newWords = [...words];
        newWords[newWords.length - 1] = name;
        return newWords.join(' ');
      }).slice(0, 5) : 
      [text]; // Keep original text if no matches
  
},
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
      this.$nextTick(() => {
      this.$refs.chatInput.focus();
    });
    }
    },
    data(){
        return {
            model: 'llama3.2:latest',
            models: ['llama3.2:latest', 'gemma:7b', 'tinyllama:latest', 'phi3:mini', 'mistral:latest', 'phi4:latest'],
            timeTaken: 0,
            operation: 'testPrompt',
            operations: ['savePrompt', 'testPrompt'],
            messages: [],
            isLoading: false,
            userInput: '',
            suggestions: [],
            company_names_list: [],
            hideNoData: true
            
        }
    }
}
</script>
<style scoped>
.chat-wrapper {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 8px;
  max-height: calc(100vh - 130px);
}

.chat-header {
  flex-shrink: 0;
}
.subtitle-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}
.messages-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* This is important for Firefox */
   height: calc(100vh - 180px); 
}

.chat-messages {
  height: 100%;
}

.chat-input {
  flex-shrink: 0;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  
}

@media (max-width: 960px) {
  .chat-input {
    margin-left: 8px;
  }
}
.message-line {
  margin: 0;  /* Remove default paragraph margins */
  min-height: 1.2em; /* Preserve empty lines */
}
.message-item {
  padding: 4px 64px; /* Reduce default v-list-item padding */
}

.message-card {
  max-width: 75%;
  border-radius: 8px;
  padding: 8px;
}

.user-message {
  margin-left: auto;
  background-color: #E3F2FD; /* Light blue */
}

.assistant-message {
  background-color: #F5F5F5; /* Light grey */
}

.white-space-pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
