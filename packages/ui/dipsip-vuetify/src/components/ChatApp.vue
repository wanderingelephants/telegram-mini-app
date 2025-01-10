<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card height="90vh" class="d-flex flex-column">
          <!-- Chat Header -->
          <v-card-title class="primary white--text">
            <v-icon left color="white">mdi-chat</v-icon>
            Ollama Chat
          </v-card-title>

          <!-- Messages Area -->
          <v-card-text class="flex-grow-1 overflow-y-auto" ref="messagesContainer">
            <v-list two-line>
              <template v-for="(message, index) in messages" :key="index">
                <v-list-item
                  :class="message.role === 'user' ? 'justify-end' : ''"
                >
                  <v-list-item-content
                    :class="[
                      'rounded-lg pa-3 ma-2',
                      message.role === 'user'
                        ? 'blue lighten-4 ml-auto'
                        : 'grey lighten-3',
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
                    ></v-progress-circular>
                    Thinking...
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <!-- Input Area -->
          <v-card-actions class="pa-4">
            <v-text-field
              v-model="userInput"
              label="Type your message"
              outlined
              dense
              hide-details
              @keyup.enter="sendMessage"
              :disabled="isLoading"
              append-outer-icon="mdi-send"
              @click:append-outer="sendMessage"
            ></v-text-field>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="showError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'ChatApp',
  
  data() {
    return {
      messages: [],
      userInput: '',
      isLoading: false,
      showError: false,
      errorMessage: '',
      model: 'llama2' // configurable model name
    }
  },

  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      const userMessage = {
        role: 'user',
        content: this.userInput.trim()
      };

      // Add user message to chat
      this.messages.push(userMessage);
      this.userInput = '';
      this.isLoading = true;

      try {
	      //For non-streaming
	      /*
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [...this.messages],
            model: this.model
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Add assistant's response to chat
        this.messages.push({
          role: 'assistant',
          content: data.response
        }); */
	      // For streaming version:

	      const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        messages: [...this.messages],
        model: this.model
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

            if (data.done) {
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

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },

  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  },

  mounted() {
	  console.log('mounted')
    // Initial scroll to bottom
    this.scrollToBottom();
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

.max-width-75 {
  max-width: 75%;
}

/* Add these styles if you want to preserve specific formatting */
.v-list-item-content {
  width: 100%;
}

.v-list-item {
  align-items: flex-start;
}
.max-width-75 {
  max-width: 75%;
}

.text-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}

/* Custom scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>