import { defineStore } from 'pinia'
export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: new Map(), // Store chat histories
    topic : [], // Store chat topics
    currentChatId: null,
    isConnected: false,
    mode : "1"
  }),

  actions: {
    loadTopic(topic){
      if (topic){
        this.topic = topic
        return
      }
      this.topic = []
    },
    setTopic(chatId,topic){
      if (this.topic.length === 0){
        this.topic.push({id:chatId,topic:topic,mode:this.mode})
        return
      }
      if (this.topic[0]?.id === chatId){
        this.topic[0].topic = topic
        return
      }
      this.topic.unshift({id:chatId,topic:topic,mode:this.mode})
      console.log(this.topic[0].mode,"mode")
      if (this.topic.length > 8){
        this.topic.pop()
      }
    },
    updateConversationOrder(chatId){
      const temp = this.topic.find((item) => item.id === chatId)
      this.topic = this.topic.filter((item) => item.id !== chatId)
      this.topic.unshift(temp)
    },
    setChat(chatId,messageList){
      this.conversations.set(chatId,messageList)
    },
    setCurrentChat(chatId) {
      this.currentChatId = chatId
      if (!this.conversations.has(chatId)) {
        this.conversations.set(chatId, [])
      }
    },
    addMessage(chatId, message) {
      if (!this.conversations.has(chatId)) {
        this.conversations.set(chatId, [])
      }
      this.conversations.get(chatId).push(message)
      this.conversations.get(chatId).push({ content: [], isUser: false,isTyping:true, isRieceving: true })
    },
    handleEnd(chatId){
      const l = this.conversations.get(chatId).length
      this.conversations.get(chatId)[l - 1].isRieceving = false
      console.log('End')
    },
    handleFinishTyping(chatId){
      const l = this.conversations.get(chatId).length
      if (this.conversations.get(chatId)[l - 1].isRieceving == true){
        return
      }
      this.conversations.get(chatId)[l - 1].content= this.conversations.get(chatId)[l-1].content.join('\n')
      this.conversations.get(chatId)[l - 1].isTyping = false
    },  
    streamToken(chatId, token) {
      const prefix = "Chủ đề-123: ";
      if (token.startsWith(prefix)) {
        // Remove `prefix` from `token`
        token = token.slice(prefix.length);
        this.setTopic(chatId,token)
        return
      }
      if (token === "end of response"){
        this.handleEnd(chatId)
        return
      }
      token = token.slice(0, -1) // Remove the last character (newline) 
      const l = this.conversations.get(chatId).length
      this.conversations.get(chatId)[l - 1]?.content.push(token)
    },

  }
})
