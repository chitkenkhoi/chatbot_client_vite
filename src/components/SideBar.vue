<template>
  <div class="sidebar">
    <img class="logo" alt="logo" src="../assets/logonew.png" />
    <div
      class="newchat"
      :class="{ focused: $route.path === '/new' }"
      @click="$router.push('/new')"
    >
      <div class="icon">
        <span class="material-symbols-outlined"> contact_support </span>
      </div>
      <div class="topic">Bắt đầu hỏi</div>
    </div>
    <div class="sidebar-foot">
      <div class="header">Tài khoản</div>
      <DropDown class="dropdown" :email="state.email" />
    </div>

    <div class="sidebar-body">
      <div class="tittle">Gần đây</div>
      <div class="menuitems">
        <router-link
          :to="`/chat/${chat.id}`"
          v-for="chat in chatStore?.topic"
          :key="chat.id"
          active-class="active"
          class="side-btn"
          :class="{ focused: $route.params.id === chat.id }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            v-if="chat?.mode !== '1'"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            v-if="chat?.mode === '1'"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14v7"
            />
          </svg>
          <!-- <span class="material-symbols-outlined"> contact_support </span> -->
          <div class="link-container">{{ chat.topic }}</div>
        </router-link>
      </div>
      <div class="tittle" id="viewall" @click="$router.push('/conversations')">
        Xem tất cả
        <span class="material-symbols-outlined" id="arr"> arrow_forward </span>
      </div>
    </div>

    <div class="help">
      <span class="material-symbols-outlined" id="info"> info </span>
      <div class="support">Help & Support</div>
    </div>
  </div>
</template>

<script>
import { reactive, onBeforeMount } from "vue";
import DropDown from "@/components/DropDown.vue";
import axiosInstance from "@/api/axios";
import { useChatStore } from "../store/index.js";
export default {
  components: {
    DropDown,
  },
  setup(_, { emit }) {
    const chatStore = useChatStore();
    const state = reactive({
      email: "",
    });
    const newChatFunc = (newchat) => {
      chatStore.setTopic(newchat);
    };
    const loadData = async () => {
      try {
        const response = await axiosInstance.get("/conversations/1");
        chatStore.loadTopic(response.data.conversations); // {id,topic,updated_at}
      } catch (error) {
        console.error(error);
      }
    };
    onBeforeMount(async () => {
      await loadData();
      state.email = localStorage.getItem("userEmail");
      emit("finish-loading");
    });
    return {
      state,
      newChatFunc,
      chatStore,
    };
  },
};
</script>

<style scoped>
.logo {
  margin-top: 10%;
  width: 50%;
  height: 10%;
  margin-right: 40%;
}
.sidebar {
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 400;
  font-size: 15px;
  width: 100%;
  height: 100%;
  background-color: rgb(57, 56, 53);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.newchat {
  margin-top: 5%;
  width: 95%;
  height: 4%;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  align-items: center;
}
.newchat.focused {
  background-color: rgb(34, 33, 29);
}
.newchat:hover {
  background-color: rgb(34, 33, 29);
}
.icon {
  width: 10%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #bc8f8f;
}
.icon1 {
  width: 10%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.topic {
  margin-left: 5%;
  width: 70%;
  /* height: 100%; */
  color: #bc8f8f;
  font-size: 20px;
}
.sidebar-body {
  width: 95%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.menuitems {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80%;
  justify-content: flex-start;
  align-items: center;
}
.side-btn {
  margin-top: 1%;
  width: 100%;
  height: 10%;
  max-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  /* margin-left: 5%; */
  padding: 2px;
  color: #f0f0f0;
  font-size: 15px;
  font-weight: 400;
  text-decoration: none;
  border-radius: 5px;
}
.avatar {
  width: 15%;
  height: 67%;
  border-radius: 50%;
  opacity: 100;
}
.side-btn:hover {
  background-color: rgb(34, 33, 29);
}
.tittle {
  width: 100%;
  height: 5%;
  color: #f0f0f0;
  font-weight: 600;
  font-size: 15px;
  text-align: left;
  margin-top: 2%;
}
.dropdown {
  margin-top: 10%;
}
#viewall {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;
  cursor: pointer;
}

.link-container {
  margin-left: 5%;
}
.side-btn.focused {
  background-color: rgb(34, 33, 29);
}
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 20;
}
#arr {
  font-size: 15px;
}
.sidebar-foot {
  width: 95%;
  height: 20%;
  color: #f0f0f0;
  font-weight: 600;
  font-size: 15px;
  text-align: left;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.header {
  width: 100%;
  height: 5%;
  color: #f0f0f0;
  font-weight: 600;
  font-size: 15px;
  text-align: left;
  margin-top: 2%;
}
.account {
  margin-top: 20px;
  width: 80%;
  height: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  background: linear-gradient(
    to bottom,
    rgba(34, 34, 34, 0) 0%,
    rgba(34, 34, 34, 0.4) 100%
  );
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
  border: 1px solid lightgray;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-radius: 10px;
}
.account:hover {
  opacity: 1;
}
.last {
  width: 80%;
  height: 15%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.help {
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 50%;
  justify-content: space-evenly;
  font-size: 13px;
  font-weight: 400;
}
#info {
  font-size: 13px;
}
</style>