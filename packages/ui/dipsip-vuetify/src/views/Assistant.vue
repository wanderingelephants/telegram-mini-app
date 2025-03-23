<template>
  <div class="chat-wrapper d-flex">
    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="sidebarOpen"
      app
      class="sidebar"
      width="300"
    >
      <v-list>
  <!-- Top Row with Icons -->
  <v-list-item>
    <v-row align="center" class="px-2 d-flex justify-space-between">
      <!-- Collapse Button -->
      
          <span  @click="toggleSidebar">
            <v-icon>$mdiChevronDoubleLeft</v-icon>
          </span>
        

      <!-- Search Button -->
      
          <span icon @click="openSearch">
            <v-icon>$mdiMagnify</v-icon>
          </span>
        

      <!-- New Chat Button -->
      
          <v-btn icon @click="startNewChat">
            <v-icon>$mdiSquareEditOutline</v-icon>
          </v-btn>
        
    </v-row>
  </v-list-item>

  <v-divider></v-divider>

  <!-- Chat History -->
  <v-list dense>
  <v-list-item
    v-for="chat in chatHistory"
    :key="chat.id"
    @click="loadChat(chat.id)"
    class="chat-list-item"
    @mouseenter="hoveredChatId = chat.id"
    @mouseleave="hoveredChatId = null"
  >
    <v-list-item-content class="d-flex justify-space-between align-center">
      
      <!-- Tooltip on Title Hov er -->
      <v-list-item-title 
        class="text-truncate chat-title"
        v-tooltip.bottom="chat.title"
      >
        {{ chat.title }}
      </v-list-item-title>

      <!-- 3-dot menu (lightweight icon) -->
      <span v-if="hoveredChatId === chat.id" @click.stop="openMenu($event, chat.id)">
        <v-icon small class="text-grey-darken-1">$mdiDotsHorizontal</v-icon>
      </span>

    </v-list-item-content>
  </v-list-item>
</v-list>


</v-list>

    </v-navigation-drawer>
    <!-- Chat Options Menu -->
    <v-menu
  v-model="menu.show"
  :position-x="menu.x"
  :position-y="menu.y"
  absolute
  attach="body"
>
      <v-list dense>
        <v-list-item @click="shareChat(menu.chatId)">
          <v-list-item-title>Share</v-list-item-title>
        </v-list-item>
        <v-list-item @click="renameChat(menu.chatId)">
          <v-list-item-title>Rename</v-list-item-title>
        </v-list-item>
       
        <v-list-item @click="deleteChat(menu.chatId)">
          <v-list-item-title class="text-error">Delete</v-list-item-title>
        </v-list-item> 
       <!--  <v-list-item @click="archiveChat(menu.chatId)">
          <v-list-item-title>Archive</v-list-item-title>
        </v-list-item>-->
      </v-list>
    </v-menu>
    <!-- Rename Chat Dialog -->
    <v-dialog v-model="renameDialog.show" max-width="400px">
      <v-card>
        <v-card-title>Rename Chat</v-card-title>
        <v-card-text>
          <v-text-field v-model="renameDialog.newTitle" label="New Chat Name" />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="renameDialog.show = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmRename">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Main Chat Area -->
    <v-card class="chat-container">
      <google-sign-in />

      <!-- Sidebar Toggle (When Collapsed) -->
      <span
        v-if="!sidebarOpen"
        class="toggle-sidebar-btn"
        icon
        @click="toggleSidebar"
      >
        <v-icon>$mdiChevronDoubleRight</v-icon>
      </span>

      <!-- Chat Header -->
      <div class="chat-header">
        <v-card-title class="primary white--text">{{ title }}</v-card-title>
        <v-card-subtitle
          class="subtitle-wrap"
          v-for="(subTitle, idx) in subTitles"
          :key="idx"
        >
          {{ subTitle }}
        </v-card-subtitle>
      </div>

      <!-- Messages Area -->
      <div class="messages-wrapper" ref="messagesContainer">
        <v-card-text class="chat-messages">
          <v-list two-line>
            <template v-for="(message, index) in messages" :key="index">
              <v-list-item :class="message.role === 'user' ? 'justify-end' : ''" class="message-item">
                <v-card :class="['message-card', message.role === 'user' ? 'user-message' : 'assistant-message']" elevation="0">
                  <v-card-title class="text-caption pb-1">
                    {{ message.role === "user" ? "You" : "Assistant" }}
                  </v-card-title>
                  <v-card-text class="white-space-pre pt-0" v-html="message.content"></v-card-text>
                  <v-btn color="primary" v-if="message.is_alert_set === true" @click="setAlert(message.id, message.chat_uuid, false)">Unset Alert</v-btn>
                </v-card>
              </v-list-item>
            </template>

            <!-- Loading indicator -->
            <v-list-item v-if="isLoading">
              <v-list-item-content class="grey lighten-3 rounded-lg pa-3 ma-2">
                <v-list-item-subtitle>
                  <v-progress-circular indeterminate color="primary" size="24" class="mr-2" />
                  Fetching Your Response...
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>

      <!-- Input Area -->
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
 <!-- Search Modal -->
    <v-dialog v-model="searchDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchQuery"
            label="Search Chats"
            clearable
            prepend-inner-icon="mdi-magnify"
          />
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-list dense>
            <v-list-item
              v-for="chat in filteredChats"
              :key="chat.id"
              @click="selectChat(chat.id)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ chat.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="searchDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      @update:modelValue="startProgress"
    >
      {{ snackbar.message }}
      <v-progress-linear :model-value="progress" color="black" height="4" class="mt-2"></v-progress-linear>
    </v-snackbar>
  </div>
</template>

<script>
import {
  USER_CHAT_HISTORY, UPDATE_USER_CHAT
} from "../lib/helper/queries";

import { mapState } from "vuex";
import GoogleSignIn from "../components/GoogleSignIn";
export default {
  name: "Assistant",
  components: {
    GoogleSignIn,
  },
  mounted() {
    document.addEventListener("click", this.handleButtonClick);
    const chatSessionId = crypto.randomUUID();
    sessionStorage.setItem("chatSessionId", chatSessionId);
      
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleButtonClick);
  },
  data() {
    return {
      sidebarOpen: false,
      hoveredChatId: null,
      menu: {
        show: false,
        x: 0,
        y: 0,
        chatId: null,
      },
      renameDialog: {
        show: false,
        chatId: null,
        newTitle: "",
      },
      searchQuery: "",
      searchDialog: false,
      chatHistory: [
       /* { id: "1", title: "Chat about Ethereum" },
        { id: "2", title: "Blockchain Scaling Solutions" },
        { id: "3", title: "Vue.js vs React for Frontend" },*/
      ],
      timeTaken: 0,
      messages: [],
      isLoading: false,
      userInput: "",
      suggestions: [],
      company_names_list: [],
      hideNoData: true,
      snackbar: {
        show: false,
        message: "",
        timeout: 3000,
        color: "orange",
      },
       progress: 100,
      interval: null,
      distilledModel: "reasoning_dseek",
      title: "Stock Market AI Assistant",
      subTitles: [
        "Ask what Google/ChatGPT cannot answer. E.g.",
        "Which stocks are present in only 2 mutual funds",
        "Which companies made positive announcements last week, and their price is now below announcement day closing price",
        "** Trained on Indian data, can make mistakes",
      ],
      userInputLabel: "This is an AI tool. Double Check",
    };
  },
  watch: {
    async userGoogle(newVal) {
      if (newVal && newVal.email){
        await this.getUserChatHistory();
      } 
    },
    "snackbar.show"(newVal) {
      
      if (newVal) {
        this.startProgress();
      } else {
        clearInterval(this.interval);
      }
    },
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    async getUserChatHistory(){
      const chatQueryResponse = await this.$apollo.query({
        query: USER_CHAT_HISTORY,
        variables: {email: this.userGoogle.email},
        fetchPolicy: "no-cache"
      })
      this.chatHistory = []
      for (const chat of chatQueryResponse.data.user_chat){
        if ((this.chatHistory.filter(ch => ch.id === chat.chat_uuid)).length === 0){
          this.chatHistory.push({
            id: chat.chat_uuid,
            title: chat.chat_title,
            messages: []
          })
        }
        
          let mesgs = (this.chatHistory.filter(ch => ch.id === chat.chat_uuid))[0].messages
          mesgs.push({
            "role": "user",
            "content": chat.textContent_user_query
          })
          const chatRecord = {
            "role": "assistant",
            "content": chat.textContent_assistant_formatted_response
          }
          if (chat.is_alert_set === true) {
            chatRecord["id"] = chat.id
            chatRecord["is_alert_set"] = true
            chatRecord["chat_uuid"] = chat.chat_uuid
          }
          mesgs.push(chatRecord)
        }
      
    },
    startNewChat() {
      const chatSessionId = crypto.randomUUID();
      sessionStorage.setItem("chatSessionId", chatSessionId);
      this.messages = []; // Clear messages for a new session
      this.title = "New Chat";
    },
    loadChat(chatId) {
      sessionStorage.setItem("chatSessionId", chatId);
      this.messages = this.chatHistory.filter(c => c.id === chatId)[0].messages
      console.log(this.messages)
    },
    openMenu(event, chatId) {
  // Prevent the default event and stop propagation
  event.preventDefault();
  event.stopPropagation();
  console.log("openMenu", event.clientX, event.clientY)
  // Set the position based on the mouse click
  this.menu.x = event.clientX;
  this.menu.y = event.clientY;
  this.menu.chatId = chatId;
  this.menu.show = true;
},
    async shareChat(chatId) {
      console.log("Sharing chat:", chatId);
      try{
          const response = await fetch("/api/chat/share", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtGoogle")}`,
          },
          body: JSON.stringify({
            chat_uuid: chatId
          }),
        });
        if (response.status !== 200) {
          this.snackbar.color = "error";
          this.snackbar.message = "Not authorized";
          this.snackbar.show = true;
          return;
        }
        const data = await response.json()
        if (data.url && data.url.endsWith(chatId)) window.open(data.url, '_blank');
      }
      catch(e){
        console.error(e)
      }
    },
    renameChat(chatId) {
      const chat = this.chatHistory.find((c) => c.id === chatId);
      if (chat) {
        this.renameDialog.chatId = chatId;
        this.renameDialog.newTitle = chat.title;
        this.renameDialog.show = true;
      }
    },
    confirmRename() {
      const chat = this.chatHistory.find((c) => c.id === this.renameDialog.chatId);
      if (chat) {
        chat.title = this.renameDialog.newTitle;
        this.renameDialog.show = false;
      }
    },
    archiveChat(chatId) {
      console.log("Archiving chat:", chatId);
    },
    deleteChat(chatId) {
      this.chatHistory = this.chatHistory.filter((chat) => chat.id !== chatId);
    },
    selectChat(chatId) {
      this.loadChat(chatId);
      this.searchDialog = false;
    },
    openSearch() {
      this.searchDialog = true;
      this.searchQuery = "";
    },
    startProgress() {
      this.progress = 100;
      const totalSteps = this.snackbar.timeout / 100;
      let currentStep = totalSteps;

      if (this.interval) clearInterval(this.interval);

      this.interval = setInterval(() => {
        currentStep--;
        this.progress = (currentStep / totalSteps) * 100;

        if (currentStep <= 0) {
          clearInterval(this.interval);
        }
      }, 100);
    },
    handleEnter(e) {
      if (this.suggestions.length && this.$refs.autocomplete.isMenuActive) {
        // Let v-autocomplete handle selection
        return;
      }
      this.sendMessage();
    },
    handleButtonClick(event) {
      const target = event.target.closest("[data-action]");
      if (!target) return;

      const action = target.getAttribute("data-action");

      if (action === "set-alert") {
        this.setAlert(target.getAttribute("data-chatid"), target.getAttribute("data-chatuuid"), true);
      } else if (action === "show-snackbar") {
        const message = target.getAttribute("data-message") || "Information";
        this.snackbar.message = message;
        this.snackbar.timeout = 10000;
        this.snackbar.show = true;
      }
    },
    async setAlert(chat_id, chat_uuid, is_alert_set) {
      try{
        const response = await  this.$apollo.query({
        query: UPDATE_USER_CHAT,
        variables: {
          chat_id, chat_uuid, is_alert_set
        },
        fetchPolicy: "no-cache"
      })
        console.log(response)
        this.getUserChatHistory()
        const message = is_alert_set === true  ? "Alert Set" : "Alert Removed"
        this.snackbar.show = true
        this.snackbar.message = message
        this.snackbar.timeout = is_alert_set === true ? 4000 : 3000
        
      }
      catch(e){
        console.error(e)
      }
      /*const response = await fetch("/api/chat/setalert", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtGoogle")}`,
          },
          body: JSON.stringify({
            chat_uuid, chat_id
          }),
      })
      console.log("setAlert server response", response)*/
    },
    async sendMessage() {
      if (!this.userGoogle) {
        this.snackbar.color = "error";
        this.snackbar.message = "Sign In needed";
        this.snackbar.show = true;
        return;
      }
      if (!this.userInput.trim()) return;
      if (this.userInput.length > 1000)
        this.userInput = this.userInput.substring(0, 1000);
      this.suggestions = [];
      const userMessage = {
        role: "user",
        content: this.userInput.trim(),
      };

      // Add user message to chat
      this.messages.push(userMessage);
      this.userInput = "";
      this.isLoading = true;
      const chatSessionId = sessionStorage.getItem("chatSessionId")
      if (!chatSessionId){
        this.snackbar.show = true
        this.snackbar.message = "Chat session not found"
        return
      }
      try {
        const response = await fetch("/api/chat/reasoning", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            Authorization: `Bearer ${localStorage.getItem("jwtGoogle")}`,
          },
          body: JSON.stringify({
            chatSessionId,
            activity: "stock_market_chat",
            messages: [...this.messages]
          }),
        });
        if (response.status !== 200) {
          this.snackbar.color = "error";
          this.snackbar.message = "Not authorized";
          this.snackbar.show = true;
          return;
        }
        // Create reader from response body
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let currentResponse = "";

        // Read the stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode the chunk and split into lines
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(5));
                if (data.error) {
                  this.showError = true;
                  this.errorMessage = data.error;
                  break;
                }

                currentResponse += data.response + "\n";
                // Update the UI with the streaming response
                if (
                  this.messages[this.messages.length - 1]?.role === "assistant"
                ) {
                  this.messages[this.messages.length - 1].content =
                    currentResponse;
                } else {
                  this.messages.push({
                    role: "assistant",
                    content: currentResponse,
                  });
                }

                if (data.done) {
                  break;
                }
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        this.errorMessage = "Failed to get response from the assistant";
        this.showError = true;
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
      await this.getUserChatHistory()
    },
    onInputChange(text) {
      if (!text) return;

      const words = text.split(/\s+/);
      const lastWord = words[words.length - 1].toLowerCase();

      let matchedCompanies = [];
      if (lastWord.length > 4) {
        matchedCompanies = this.company_names_list.filter((name) =>
          name.toLowerCase().includes(lastWord)
        );
      }
      this.suggestions =
        matchedCompanies.length > 0
          ? matchedCompanies
              .map((name) => {
                const newWords = [...words];
                newWords[newWords.length - 1] = name;
                return newWords.join(" ");
              })
              .slice(0, 5)
          : [text]; // Keep original text if no matches
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
      this.$nextTick(() => {
        this.$refs.chatInput.focus();
      });
    },
  },
  computed: {
  ...mapState([
    "loggedInGoogle",
    "userGoogle",
  ]),
  filteredChats() {
      if (!this.searchQuery) return this.chatHistory;
      return this.chatHistory.filter((chat) =>
        chat.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  
},
};
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
  margin: 0; /* Remove default paragraph margins */
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
  background-color: #e3f2fd; /* Light blue */
}

.assistant-message {
  background-color: #f5f5f5; /* Light grey */
}

.white-space-pre {
  white-space: pre-wrap;
  word-break: break-word;
}
.red-button {
  background-color: #ff3b30;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s;
}

.red-button:hover {
  background-color: #ff6651;
}

.red-button:active {
  background-color: #e0352b;
  transform: translateY(1px);
}
.chat-wrapper {
  display: flex;
  height: 100vh;
}
.sidebar {
  background-color: #f5f5f5;
}
.chat-list-item {
  position: relative;
}
</style>
