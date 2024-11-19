<template>
  <div class="popupcontainer" v-if="showImageUpload" @click="handlePopup">
    <FileUpload
      class="popup"
      @click.stop
      @file-uploaded="handleUploaded"
      ref="fileUploadRef"
    />
  </div>
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
    <div class="sidebar-container">
      <SideBar ref="sideBarRef" @finish-loading="handleFinishLoading" />
    </div>
    <div
      class="imageContainer"
      v-if="
        (this.$route.name === 'new' && chatStore.file.has('new')) ||
        chatStore.file.has(this.$route.params.id)
      "
    >
      <img :src="previewUrl" alt="Preview" class="image-preview" />
    </div>
    <AskInputVue
      class="chat"
      :isNew="$route.path === '/new'"
      @newChat="handleNewChat"
      @toggle-image-upload="handlePopup"
      @clearfile="handleClearfile"
    />
    <div class="askcontainer"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onBeforeMount } from "vue";
// Import the DynamicSidebar component
import FileUpload from "@/components/FileUpload.vue";
import SideBar from "@/components/SideBar.vue";
import AskInputVue from "@/components/AskInput.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

import axiosInstance from "@/api/axios";
import { useRouter } from "vue-router";
import { useChatStore } from "../store";
export default defineComponent({
  name: "HomeView",
  // Register the DynamicSidebar component
  components: {
    SideBar,
    AskInputVue,
    LoadingSpinner,
    FileUpload,
  },
  setup() {
    const router = useRouter();
    const previewUrl = ref("");
    const chatStore = useChatStore();
    const fileUploadRef = ref(null);
    const showImageUpload = ref(false);
    const createPreview = (file) => {
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
      }
      previewUrl.value = URL.createObjectURL(file);
    };
    const handleUploaded = () => {
      if (fileUploadRef?.value?.isUploading) {
        return;
      }
      showImageUpload.value = !showImageUpload.value;
      router.currentRoute.value.name === "new"
        ? createPreview(chatStore.file.get("new").file)
        : createPreview(
            chatStore.file.get(router.currentRoute.value.params.id).file
          );
    };
    const handleClearfile = () => {
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
      }
      previewUrl.value = "";
    };
    const handlePopup = () => {
      if (fileUploadRef?.value?.isUploading) {
        return;
      }
      showImageUpload.value = !showImageUpload.value;
    };
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
      await sleep(200);
      isLoadingAuth.value = false;
    });
    return {
      sideBarRef,
      state,
      handleNewChat,
      isLoadingAuth,
      isLoadingSidebar,
      handleFinishLoading,
      showImageUpload,
      handlePopup,
      fileUploadRef,
      chatStore,
      previewUrl,
      createPreview,
      handleUploaded,
      handleClearfile,
    };
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
.imageContainer {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  position: fixed;
  bottom: 7%;
  left: 27%;
  width: 66%;
  background-color: rgba(255, 255, 255, 0.7);
  height: 20%;
  z-index: 99;
  border-radius: 20px;
}
.image-preview {
  opacity: 1;
  max-width: 20%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 20px;
  border: 1px solid lightgray;
}
.chat {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 70%;
  left: 25%;
  height: 9%;
}
.popupcontainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  background-color: white;
  z-index: 1001;
  border-radius: 10px;
  padding: 20px;
}
</style>