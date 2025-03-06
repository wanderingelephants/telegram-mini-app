<template>
    <v-card class="chat-container">
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
                </v-card>
              </v-list-item>
            </template>

            <!-- Loading indicator -->
            
          </v-list>
        </v-card-text>
      </div>
    </v-card>
</template>
<script>
import {
  CHAT_VIEW
} from "../lib/helper/queries";

export default{
    async mounted(){
        console.log("mounted", this.$route.params)
        const resp = await fetch("/api/chat/view?chat_uuid="+this.$route.params.uuid,  {method: "GET"})
        console.log("resp", resp)
        const data = await resp.json()
        this.chatHistory = []
      for (const chat of data){
        console.log("chat", chat)
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
          mesgs.push({
            "role": "assistant",
            "content": chat.textContent_assistant_formatted_response
          })
        }
      console.log("chatHistory", this.chatHistory)
      this.messages = this.chatHistory[0].messages
    },
    data(){
      return{
        messages: [],
      }
    }

}
</script>
<style scoped>
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
</style>
