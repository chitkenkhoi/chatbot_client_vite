<!-- ConversationsList.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import axiosInstance from '@/api/axios'
const conversations = ref([])
const selectedConversationId = ref(null)
const isLoading = ref(true)

// Fetch conversations from your API
const fetchConversations = async () => {
  try {
    isLoading.value = true
    // Replace this with your actual API call
    const response = await axiosInstance.get('/test/conversations')
    const data =response.data.list
    // const response = await fetch('/api/conversations')
    // const data = await response.json()
    conversations.value = data.map(conv => ({
      ...conv,
      updatedAt: new Date(conv.updatedAt)
    }))
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
  } finally {
    isLoading.value = false
  }
}

const selectConversation = (id) => {
  selectedConversationId.value = id
  // Emit event or handle navigation
}

const formatDate = (date) => {
  const now = new Date()
  if (date.toDateString() === now.toDateString()) {
    return format(date, 'h:mm a')
  }
  if (date.getFullYear() === now.getFullYear()) {
    return format(date, 'MMM d')
  }
  return format(date, 'MMM d, yyyy')
}

onMounted(() => {
  fetchConversations()
})
</script>

<template>
  <div class="conversations-container">
    <header class="conversations-header">
      <h2 class="header-title">Recent conversations</h2>
      <button class="new-chat-button" @click="$emit('new-chat')">
        New chat
      </button>
    </header>

    <div class="conversations-list" v-if="!isLoading">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="conversation-item"
        :class="{ 
          'selected': selectedConversationId === conversation.id,
          'unread': conversation.unread 
        }"
        @click="selectConversation(conversation.id)"
      >
        <div class="conversation-content">
          <h3 class="conversation-title">{{ conversation.title }}</h3>
          <p class="conversation-preview">{{ conversation.lastMessage }}</p>
        </div>
        <time class="conversation-time">{{ formatDate(conversation.updatedAt) }}</time>
      </div>
    </div>

    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading conversations...</p>
    </div>
  </div>
</template>

<style scoped>
.conversations-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 300px;
  border-right: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.conversations-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.new-chat-button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.new-chat-button:hover {
  background-color: #1d4ed8;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.conversation-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 0.25rem;
}

.conversation-item:hover {
  background-color: #f3f4f6;
}

.conversation-item.selected {
  background-color: #e5e7eb;
}

.conversation-item.unread {
  font-weight: 600;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-preview {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.75rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
}

.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>