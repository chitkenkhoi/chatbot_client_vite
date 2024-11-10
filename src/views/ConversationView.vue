<!-- ConversationView.vue -->

<template>
  <LoadingSpinnerVue
    v-if="state.isLoading"
    :size="100"
    color="#bc8f8f"
    text=""
    :fullscreen="false"
  />
  <div v-if="!state.isLoading && !state.error">
    <div class="container">
      <!-- Add ref to messagelist -->
      <div class="messagelist" ref="messageListRef" @scroll="handleScroll">
        <div
          class="message"
          v-for="message in chatStore.conversations.get(
            chatStore.currentChatId
          )"
          :key="message"
          :class="{ isuser: message.isUser }"
        >
          <img
            class="avatar"
            alt="logo"
            :src="message.isUser ? '/human_avatar.webp' : '/avatar.webp'"
          />
          <div class="content" :class="{ isuser: message.isUser }">
            <StreamingResponse
              :typingSpeed="5"
              :enableTyping="message.isTyping? true : false"
              :content="message.isTyping? '' : message?.content"
              :streamedLines="message.isTyping ? message?.content : []"
              @finishTyping="handleFinishTyping"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="state.error" class="error-message">
    {{ state.error }}
  </div>
</template>

<script>
import StreamingResponse from "@/components/StreamingResponse.vue";
import LoadingSpinnerVue from "@/components/LoadingSpinner.vue";
import { reactive, watch, ref, nextTick } from "vue";
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import axiosInstance from "@/api/axios";
import { useWebSocket } from "../composables/useWebSocket";
import { useChatStore } from "../store/index.js";

export default {
  components: {
    LoadingSpinnerVue,
    StreamingResponse,
  },
  setup() {
    const chatStore = useChatStore();
    const route = useRoute();
    const messageListRef = ref(null);
    const shouldAutoScroll = ref(true); // Track if we should auto-scroll
    const isNearBottom = () => {
      const container = messageListRef.value;
      if (!container) return false;
      
      // Calculate how far we are from bottom
      const threshold = 100; // pixels from bottom to consider "near bottom"
      const bottomPosition = container.scrollHeight - container.scrollTop - container.clientHeight;
      return bottomPosition < threshold;
    };
    const handleScroll = () => {
      shouldAutoScroll.value = isNearBottom();
    };
    // Add scroll to bottom function
    const scrollToBottom = async () => {
      await nextTick();
      if (messageListRef.value && shouldAutoScroll.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
      }
    };

    const state = reactive({
      isLoading: false,
      chatData: null,
      error: null,
    });

    // Watch for changes in the conversation
    watch(
      () => chatStore.conversations.get(chatStore.currentChatId),
      async () => {
        await scrollToBottom();
      },
      { deep: true }
    );

    onMounted(async () => {
      chatStore.setCurrentChat(route.params.id);
      useWebSocket(route.params.id).connectWebSocket();
      await loadData();
      shouldAutoScroll.value = true;
      await scrollToBottom();
    });

    onUnmounted(() => {
      useWebSocket(route.params.id).disconnectWebSocket();
    });

    const loadData = async () => {
      const chatId = route.params.id;
      state.error = null;
      
      if (
        chatStore.conversations.get(chatId) &&
        chatStore.conversations.get(chatId).length !== 0
      ) {
        await scrollToBottom();
        return;
      }

      const controller = new AbortController();

      try {
        state.isLoading = true;
        const response = await axiosInstance.get(
          `/conversation/${route.params.id}`,
          {
            signal: controller.signal,
          }
        );

        const messageList = response.data.conversation.messages.map(
          (message) => {
            const { sender, ...rest } = message;
            return {
              isUser: sender === "user",
              ...rest,
            };
          }
        );
        chatStore.setChat(chatId, messageList);
        state.isLoading = false;
        await scrollToBottom();
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
        } else {
          console.error(`Error loading chat ${chatId}:`, error);
          state.error = error.message;
          state.isLoading = false;
        }
      }

      return () => {
        controller.abort();
        state.isLoading = true;
      };
    };

    watch(
      () => route.params.id,
      async (newId, oldId) => {
        if (newId !== oldId) {
          await loadData();
          chatStore.setCurrentChat(newId);
          useWebSocket(oldId).disconnectWebSocket();
          useWebSocket(newId).connectWebSocket();
        }
      },
      { flush: "post" }
    );

    const handleFinishTyping = async () => {
      chatStore.handleFinishTyping(route.params.id);
      await scrollToBottom();
    };

    return {
      state,
      chatStore,
      handleFinishTyping,
      messageListRef,
      handleScroll,
    };
  },
};
</script>
<style scoped>
.container {
  position: fixed;
  top: 0;
  left: 15%;
  height: 100%;
  background-color: #f5f5f5;
  width: 85%;
  max-width: 85%;
}
.messagelist {
  margin: 0 auto;
  padding: 20px;
  height: 87%;
  overflow-y: auto;
  background-color: #f5f5f5;
  scroll-behavior: smooth;
}
.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-in-out;
}
.message .content {
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 400;
  background-color: #ffffff;
  padding: 12px 16px;
  border-radius: 0 15px 15px 15px;
  max-width: 60%;
  margin-right: 0px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  text-align: left;
  margin-left: 15px;
}
.content {
  margin-top: 15px;
  white-space: pre-wrap;
}
.content.isuser {
  margin-left: none;
  margin-right: 15px;
  border-radius: 15px 0 15px 15px;
}
.message .avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #ffffff;
}
.message.isuser {
  flex-direction: row-reverse;
  text-align: left;
}
</style>