<!-- StreamingResponse.vue -->
<template>
  <div class="response-container">
    <div class="message">
      <!-- If animation is off, display all lines directly -->
      <template v-if="!enableTyping">
        <div>
          {{content}}
        </div>
      </template>
      
      <!-- If animation is on, show animated typing -->
      <template v-else>
        <!-- Already completed lines -->
        <div v-for="(line, index) in displayedLines" :key="`complete-${index}`">
          {{ line }}
        </div>
        <!-- Currently typing line -->
        <div v-if="currentLineDisplay">
          {{ currentLineDisplay }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onBeforeUnmount, onMounted } from 'vue';

const emit = defineEmits(['finishTyping']);
const props = defineProps({
  streamedLines: {
    type: Array,
    required: true,
    default: () => []
  },
  typingSpeed: {
    type: Number,
    default: 1000
  },
  enableTyping: {
    type: Boolean,
    default: true
  },
  content: {
    type: String,
    default: ""
  }
});

const displayedLines = ref([]);
const currentLineDisplay = ref('');
const processingQueue = ref(false);
const currentIndex = ref(0);
const currentLineText = ref('');
const startTime = ref(null);
const isHidden = ref(false);

// Handle visibility change
onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

const handleVisibilityChange = () => {
  isHidden.value = document.hidden;
  if (!document.hidden) {
    // When returning to the tab, update display to show what was processed in background
    updateDisplay();
  }
};

function updateDisplay() {
  if (!currentLineText.value) return;
  
  const now = Date.now();
  const elapsedTime = now - startTime.value;
  const charactersToShow = Math.floor(elapsedTime / props.typingSpeed);
  
  // Update the display to show the correct number of characters
  currentIndex.value = Math.min(charactersToShow, currentLineText.value.length);
  currentLineDisplay.value = currentLineText.value.slice(0, currentIndex.value);
  
  // If we've completed the current line while in background
  if (currentIndex.value >= currentLineText.value.length) {
    displayedLines.value.push(currentLineText.value);
    currentLineDisplay.value = '';
    currentLineText.value = '';
  }
}

// Watch for new lines being added to streamedLines
watch(() => props.streamedLines, async (newLines) => {
  if (!props.enableTyping) return;
  if (processingQueue.value) return;
  
  try {
    processingQueue.value = true;
    await processLines(newLines);
  } finally {
    processingQueue.value = false;
    emit('finishTyping');
  }
}, { deep: true });

const processLines = async (newLines) => {
  while (displayedLines.value.length < newLines.length) {
    const nextLineIndex = displayedLines.value.length;
    currentLineText.value = newLines[nextLineIndex];
    currentIndex.value = 0;
    startTime.value = Date.now();
    
    await typeCurrentLine();
  }
};

const typeCurrentLine = () => {
  return new Promise((resolve) => {
    const processCharacter = () => {
      const now = Date.now();
      const elapsedTime = now - startTime.value;
      const charactersToShow = Math.floor(elapsedTime / props.typingSpeed);
      
      if (charactersToShow > currentIndex.value) {
        currentIndex.value = Math.min(charactersToShow, currentLineText.value.length);
        if (!isHidden.value) {
          // Only update visual display if tab is visible
          currentLineDisplay.value = currentLineText.value.slice(0, currentIndex.value);
        }
      }
      
      if (currentIndex.value >= currentLineText.value.length) {
        displayedLines.value.push(currentLineText.value);
        currentLineDisplay.value = '';
        currentLineText.value = '';
        resolve();
        return;
      }
      
      setTimeout(processCharacter, 16); // Roughly 60fps
    };
    
    processCharacter();
  });
};
</script>

<style scoped>
.response-container {
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 400;
  white-space: pre-wrap;
  word-break: break-word;
}

.message > div {
  min-height: 1.2em;
}
</style>