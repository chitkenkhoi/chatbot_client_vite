<template>
  <LoadingSpinner
    v-if="isLoadingAuth"
    :size="50"
    color="#ff4081"
    text="Loading..."
    :fullscreen="true"
  />
  <div class="home" v-if="!isLoadingAuth">
    <!-- Your existing home view content -->

    <!-- Add the DynamicSidebar component here -->
    <div class="sidebar-container"><SideBar ref="sideBarRef" @finish-loading="handleFinishLoading"/></div>
    <AskInputVue
      class="chat"
      :isNew="$route.path === '/new'"
      @newChat="handleNewChat"
    />
    <div class="askcontainer"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount } from "vue";
// Import the DynamicSidebar component
import SideBar from "@/components/SideBar.vue";
import AskInputVue from "@/components/AskInput.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import axiosInstance from "@/api/axios";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "HomeView",
  // Register the DynamicSidebar component
  components: {
    SideBar,
    AskInputVue,
    LoadingSpinner,
  },
  setup() {
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    const isLoadingAuth = ref(true);
    const isLoadingSidebar = ref(true);
    const handleFinishLoading = () => {
      isLoadingSidebar.value = false;
    };
    const sideBarRef = ref(null);
    const state = reactive({
      chat_history: [],
    });
    const router = useRouter();
    const handleNewChat = (chat) => {
      sideBarRef.value.newChatFunc(chat);
    };
    const auth = async () => {
      try {
        const response = await axiosInstance.get("/ping");
        if (response.data.message !== "pong") {
          router.push("/login");
        } else if (router.currentRoute.value.path === "/") {
          router.push("/new");
        }
      } catch (e) {
        console.log(e);
        router.push("/login");
      }
    };
    onBeforeMount(async () => {
      await auth();
      await sleep(1000);
      isLoadingAuth.value = false;
    });
    return { sideBarRef, state, handleNewChat, isLoadingAuth,isLoadingSidebar,handleFinishLoading };
  },
});
</script>
<style scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 15%;
  background-color: #f0f0f0;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chat {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 70%;
  left: 25%;
  height: 9%;
}
</style>