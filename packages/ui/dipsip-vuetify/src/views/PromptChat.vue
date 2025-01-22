<template>
  <div class="chat-wrapper">
    <v-card class="chat-container">
      <!-- Chat Header - Fixed -->
      <div class="chat-header">
        <v-card-title class="primary white--text">
          {{ title }}
        </v-card-title>
        <v-card-subtitle>{{ subTitle }}</v-card-subtitle>
      </div>

      <!-- Messages Area - Scrollable -->
      <div class="messages-wrapper">
        <v-card-text class="chat-messages" ref="messagesContainer">
          <v-list two-line>
            <template v-for="(message, index) in messages" :key="index">
              <v-list-item :class="message.role === 'user' ? 'justify-end' : ''">
                <v-list-item-content
                  :class="[
                    'rounded-lg pa-3 ma-2',
                    message.role === 'user' ? 'blue lighten-4 ml-auto' : 'grey lighten-3',
                    'max-width-75'
                  ]"
                >
                  <v-list-item-title class="mb-2">
                    {{ message.role === 'user' ? 'You' : 'Assistant' }}
                  </v-list-item-title>
                  <div class="message-content">
                    {{ message.content }}
                  </div>
                </v-list-item-content>
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
            v-model="userInput"
            :label="userInputLabel"
            :disabled="isLoading"
            variant="outlined"
            density="comfortable"
            hide-details
            @keyup.enter="sendMessage"
            append-inner-icon="mdi-send"
            @click:append-inner="sendMessage"
          />
        </v-card-actions>
      </div>
    </v-card>
  </div>
</template>

<script>

export default{
    props:{
        systemPrompt: {
            required: true,
            type: String
        },
        title: {
            required: true,
            type: String
        },
        subTitle: {
            required: true,
            type: String
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
        async sendMessage() {
      if (!this.userInput.trim()) return;
console.log('sendMessage')
      const userMessage = {
        role: 'user',
        content: this.userInput.trim()
      };

      // Add user message to chat
      this.messages.push(userMessage);
      this.userInput = '';
      this.isLoading = true;

      try {
	      const response = await fetch('/api/ollama/promptChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: this.model,
        operation: this.operation,
        //systemPrompt: this.systemPrompt,
        promptName: 'dipsip',
        messages: [...this.messages]
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


            currentResponse += data.response;
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
            
        }
    }
}
</script>
<style scoped>
.chat-wrapper {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 8px;
}

.chat-header {
  flex-shrink: 0;
}

.messages-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
  /* Add padding bottom to prevent messages from being hidden behind input */
  padding-bottom: 80px;
}

.chat-messages {
  height: 100%;
}

.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 1;
  /* Adjust these margins to match your layout */
  margin: 8px;
  margin-left: 50%;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

@media (max-width: 960px) {
  .chat-input {
    margin-left: 8px;
  }
}

.max-width-75 {
  max-width: 75%;
}
</style>
