<!-- ProfileDropdown.vue -->
<template>
  <div class="dropdown-container">
    <!-- Profile Button -->
    <button @click="toggleDropdown" class="profile-button">
      <div class="avatar">
        <span>{{ userInitial }}</span>
      </div>
      <div class="email-container">
        <span class="email">{{ email }}</span>
        <svg
          class="chevron-icon"
          :class="{ rotate: isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <div v-show="isOpen" class="dropdown-menu">
      <!-- Personal Pro Plan Section -->
      <div class="plan-section">
        <div class="plan-content">
          <div>
            <p class="plan-title">Tài khoản</p>
            <p class="plan-type">Đã xác thực</p>
          </div>
          <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="menu-items">
        <router-link
          v-for="(item, index) in menuItems"
          :key="index"
          :to="''"
          class="menu-item"
        >
          <component :is="item.icon" class="menu-icon" aria-hidden="true" />
          {{ item.label }}
          <svg
            v-if="item.external"
            class="external-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </router-link>
      </div>

      <!-- Log Out -->
      <div class="logout-section">
        <button @click="handleLogout" class="logout-button">
          <svg
            class="logout-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Đăng xuất
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted, onUnmounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/api/axios";
import { useChatStore } from "../store";
const chatStore = useChatStore();
const props = defineProps({
  email: {
    type: String,
    required: true,
    default: "mhuylqda14726@gmail.com",
  },
});

const router = useRouter();
const isOpen = ref(false);

const userInitial = computed(() => {
  return props.email.charAt(0).toUpperCase();
});

const menuItems = [
  {
    label: "Cài đặt",
    path: "/settings",
    icon: "CogIcon",
  },
  {
    label: "Giao diện",
    path: "/appearance",
    icon: "PaintBrushIcon",
  },
  {
    label: "Chức năng",
    path: "/features",
    icon: "SparklesIcon",
  },
  {
    label: "Khám phá",
    path: "/learn",
    icon: "AcademicCapIcon",
  },
  {
    label: "Hỗ trợ và hướng dẫn",
    path: "/support",
    icon: "QuestionMarkCircleIcon",
    external: true,
  },
];

// Handle click outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector(".dropdown-container");
  if (dropdown && !dropdown.contains(event.target)) {
    isOpen.value = false;
  }
};

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Add and remove event listeners
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleLogout = async () => {
  // Add your logout logic here
  const response = await axiosInstance.get("/logout");
  if (response.status === 200) {
    router.push("/login");
    chatStore.resetState();
  }
};
</script>
  
  <style scoped>
.dropdown-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  max-width: 300px;
}

.profile-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar span {
  color: white;
  font-size: 12px;
}

.email-container {
  display: flex;
  align-items: center;
}

.email {
  color: #e5e7eb;
  font-size: 12px;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  color: #9ca3af;
  transition: transform 0.2s;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: fixed;
  left: 9px;
  top: 30%;
  width: 14%;
  background-color: #1f2937;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: dropdownFade 0.2s ease-out;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.plan-section {
  padding: 12px 16px;
  border-bottom: 1px solid #374151;
}

.plan-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-title {
  color: #e5e7eb;
  font-size: 14px;
  margin: 0;
}

.plan-type {
  color: #9ca3af;
  font-size: 12px;
  margin: 0;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #f97316;
}

.menu-items {
  padding: 4px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #d1d5db;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #374151;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  color: #9ca3af;
}

.external-icon {
  width: 16px;
  height: 16px;
  margin-left: auto;
  color: #9ca3af;
}

.logout-section {
  border-top: 1px solid #374151;
  padding: 4px 0;
}

.logout-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  background: none;
  border: none;
  color: #d1d5db;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 500;
}

.logout-button:hover {
  background-color: #374151;
}

.logout-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  color: #9ca3af;
}
</style>