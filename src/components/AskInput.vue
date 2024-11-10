<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <input
        v-model="message"
        type="text"
        :placeholder="
          $route.name === 'new' ? 'Hỏi câu hỏi mới...' : 'Trả lời...'
        "
        class="ask"
        @keyup.enter="sendMessage"
      />
      <div class="submit" @click="sendMessage">
        <span class="material-symbols-outlined"> send </span>
      </div>
    </div>
  </form>
</template>
<script>
import axiosInstance from "@/api/axios.js";
import { ref,watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChatStore } from "../store/index.js";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const chatStore = useChatStore();
    const message = ref("");

    const sendMessage = async () => {
      if (!message.value.trim()) return;

      const messageContent = message.value;
      message.value = ""; // Clear input

      try {
        if (route.name === "new") {
          // Case 1: New conversation
          const params = new URLSearchParams();
          params.append("message", messageContent);
          params.append("mode",chatStore.mode)
          const response = await axiosInstance.post(
            "/conversation/new",
            params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          const chatId = response.data.cid;
          chatStore.addMessage(chatId, {
            content: messageContent,
            isUser: true,
          });
          chatStore.setTopic(chatId,"");
          router.push(`/chat/${chatId}`);
        } else {
          // Case 2: Existing conversation
          chatStore.addMessage(route.params.id, {
            content: messageContent,
            isUser: true,
          });
          const params = new URLSearchParams();
          params.append("message", messageContent);
          const response = await axiosInstance.post(
            `/conversation/${route.params.id}`,
            params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          if (response.data.message === "success") {
            chatStore.updateConversationOrder(route.params.id);
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error (maybe show a notification)
      }
    };
    watch(
      () => route.params.id,
      (newId, oldId) => {
        if (newId !== oldId) {
          message.value = ""
        }
      },
      { flush: "post" }
    );
    return {
      message,
      sendMessage,
    };
  },
};
</script>
<style scoped>
.ask {
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 400;
  font-size: 10px;
  width: 100%;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 0 10px;
  font-size: 16px;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 20px;
}
.form-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.ask:focus {
  outline: none;
  border: 1px solid #ccc;
}
.submit {
  position: fixed;
  right: 6%;
  cursor: pointer;
}
</style>