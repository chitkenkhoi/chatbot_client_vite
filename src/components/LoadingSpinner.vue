<template>
    <div class="loading-container" :class="{ 'is-fullscreen': fullscreen }">
      <div class="spinner" :style="{ width: size + 'px', height: size + 'px' }">
        <svg viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="4"
            :stroke="color"
          />
        </svg>
      </div>
      <div v-if="text" class="loading-text" :style="{ color: color }">
        {{ text }}
      </div>
    </div>
  </template>
  
  <script>
import { defineComponent } from "vue";
  export default defineComponent({
    name: "LoadingSpinner",
    props: {
      size: {
        type: Number,
        default: 40
      },
      color: {
        type: String,
        default: '#1e88e5'
      },
      text: {
        type: String,
        default: ''
      },
      fullscreen: {
        type: Boolean,
        default: false
      }
    }
  });
  // defineProps({
  //   size: {
  //     type: Number,
  //     default: 40
  //   },
  //   color: {
  //     type: String,
  //     default: '#1e88e5'
  //   },
  //   text: {
  //     type: String,
  //     default: ''
  //   },
  //   fullscreen: {
  //     type: Boolean,
  //     default: false
  //   }
  // });
  // export default()
  </script>
  
  <style scoped>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .is-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  }
  
  .spinner {
    animation: rotate 1.5s linear infinite;
  }
  
  .loading-text {
    margin-top: 10px;
    font-size: 14px;
  }
  
  .path {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
  
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
  </style>