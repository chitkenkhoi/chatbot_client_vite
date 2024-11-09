<template>
  <div class="home">
    <!-- Your existing home view content -->

    <!-- Add the DynamicSidebar component here -->
    <div class="sidebar-container"><SideBar ref = "sideBarRef"/></div>
    <AskInputVue
      class="chat"
      @reply="handleReply"
      :isNew="$route.path === '/new'"

      @newChat="handleNewChat"
    />
    <div class="askcontainer"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, reactive,ref,onBeforeMount } from "vue";
// Import the DynamicSidebar component
import SideBar from "@/components/SideBar.vue";
import AskInputVue from "@/components/AskInput.vue";
import axiosInstance from "@/api/axios";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "HomeView",
  // Register the DynamicSidebar component
  components: {
    SideBar,
    AskInputVue,
  },
  setup() {
    const sideBarRef= ref(null);
    const state = reactive({
      chat_history: [],
    });
    const router = useRouter()
    const handleReply = (data) => {
      console.log(data, "reply");
    };
    const handleNewChat = (chat)=>{
      
      sideBarRef.value.newChatFunc(chat)
    }
    const auth = async ()=>{
      try{
        const response = await axiosInstance.get("/ping")
        if (response.data.message !== "pong"){
          router.push('/login')
        }else if (router.currentRoute.value.path === "/") {
          router.push("/new");
        }
      }catch(e){
        console.log(e)
        router.push('/login')
      }
    }
    onBeforeMount(()=>{
      auth()
    })
    return { handleReply,sideBarRef,state,handleNewChat };
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
  z-index:100;
  width: 70%;
  left: 25%;
  height:9%;
}
</style>