<template>
  <div class="sidebar-container" @mouseleave="hideSidebar">
    <div class="sidebar-trigger" @mouseenter="showSidebar"></div>
    <transition name="slide">
      <div v-if="isVisible || isPinned" class="sidebar">
        <div
          class="pin-button"
          @click="
            () => {
              isPinned = !isPinned;
            }
          "
        >
          <!-- <span class="material-symbols-outlined">
            {{ isPinned ? "lock_open" : "lock" }}
          </span> -->
          <span
            class="material-symbols-outlined"
            :class="{ '-pinned': isPinned }"
          >
            double_arrow
          </span>
        </div>
        <!-- Your sidebar content goes here -->
        <div class="newchat">Hỏi câu mới</div>
        <div>Gần đây</div>
        <div class="conversationList">
          <div
            v-for="item in conversationList"
            :key="item.id"
            @click="handleConversation(item.id)"
          >
            {{ item.topic }}
          </div>
        </div>
        <p>This is your dynamic sidebar.</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    console.log("rendered once");
    const conversationList = ref([
      {
        id: "123",
        topic: "Topic1",
      },
      {
        id: "456",
        topic: "Topic2",
      },
      {
        id: "789",
        topic: "Topic3",
      },
      {
        id: "101",
        topic: "Topic4",
      },
    ]);
    const isPinned = ref(true);
    const isVisible = ref(false);
    let hideTimeout = null;

    const showSidebar = () => {
      console.log("this is show");
      if (isPinned.value) return;

      clearTimeout(hideTimeout);
      isVisible.value = true;
    };

    const hideSidebar = () => {
      console.log("this is hide");
      if (isPinned.value) return;
      hideTimeout = setTimeout(() => {
        isVisible.value = false;
      }, 500);
    };

    return {
      conversationList,
      isPinned,
      isVisible,
      showSidebar,
      hideSidebar,
    };
  },
  methods: {
    handleConversation(id) {
      this.$router.push(`/chat/${id}`);
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.sidebar-trigger {
  width: 100px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.pin-button {
  margin-left: 90%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 10px;
}
.pin-button:hover {
  background: gray;
  opacity: 100%;
}
.-pinned {
  transform: rotate(180deg);
}
.sidebar {
  width: 250px;
  height: 100%;
  background-color: #f0f0f0;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.newchat {
  width: 100%;
  height: 10%;
  cursor: pointer;
  text-align: left;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>