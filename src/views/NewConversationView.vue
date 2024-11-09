<template>
  <div class="new">
    <h1 class="greeting">{{ greetings }}</h1>
    <div class="modeList">
      <div 
        class="mode" 
        :class="{ '-choose': chatStore.mode === '1' }" 
        @click="choose('1')"
      >
        <div class="mode-content">
          <div class="mode-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7"/>
            </svg>
          </div>
          <h2 class="mode-title">Công tác học vụ</h2>
          <p class="mode-description">Nhận thông tin cụ thể về công tác học vụ, các khóa học và quy định của trường</p>
        </div>
      </div>
      <div 
        class="mode" 
        :class="{ '-choose': chatStore.mode === '2' }" 
        @click="choose('2')"
      >
        <div class="mode-content">
          <div class="mode-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <h2 class="mode-title">Trò Chuyện Chung</h2>
          <p class="mode-description">Hỏi bất cứ điều gì! Nhận trợ giúp với các câu hỏi chung và trò chuyện thông thường</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useChatStore } from "@/store";
import { defineComponent, onBeforeMount } from "vue";
export default defineComponent({
  name: "NewConversationView",
  setup() {
    const chatStore = useChatStore();

    const currentHour = new Date().getHours();
    const greetings =
      5 < currentHour && currentHour < 10
        ? "Chào buổi sáng " + localStorage.getItem("userName")
        : 10 <= currentHour && currentHour <= 13
        ? "Chào buổi trưa " + localStorage.getItem("userName")
        : 13 < currentHour && currentHour <= 18
        ? "Chào buổi chiều " + localStorage.getItem("userName")
        : "Chào buổi tối " + localStorage.getItem("userName");
    
    
    const choose = (mode) => {
      chatStore.mode = mode;
    };
    onBeforeMount(() => {
      chatStore.mode = "1";
    });
    return {
      greetings,
      choose,
      chatStore
    };
  },
  
});
</script>

<style scoped>
.new {
  width: 85%;
  font-family: "Baloo Paaji 2", sans-serif;
  max-width: 85%;
  margin: 0 auto;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  background-color: #f8f9fa;
  position: fixed;
  top: 0;
  left: 15%;
}

.greeting {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.modeList {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5rem;
  position: fixed;
  top: 50%;
  left: 58%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 1200px;
}

.mode {
  flex: 1;
  max-width: 400px;
  aspect-ratio: 1;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.mode:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-color: #D2B48C;
}

.mode.-choose {
  background-color: #D2B48C;
  border-color: #B8860B;
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.mode.-choose .mode-title,
.mode.-choose .mode-description {
  color: white;
}

.mode.-choose .icon {
  stroke: white;
}

.mode-content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.mode-icon {
  margin-bottom: 1.5rem;
}

.icon {
  width: 64px;
  height: 64px;
  stroke: #2c3e50;
  stroke-width: 1.5;
  transition: all 0.3s ease;
}

.mode-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.mode-description {
  font-size: 0.95rem;
  color: #6c757d;
  line-height: 1.5;
  transition: all 0.3s ease;
  max-width: 80%;
}

@media (max-width: 768px) {
  .modeList {
    flex-direction: column;
    top: 40%;
    gap: 1rem;
  }

  .mode {
    width: 100%;
    aspect-ratio: 16/9;
  }

  .mode-content {
    padding: 1rem;
  }

  .icon {
    width: 48px;
    height: 48px;
  }

  .mode-title {
    font-size: 1.25rem;
  }

  .mode-description {
    font-size: 0.875rem;
  }
}
</style>