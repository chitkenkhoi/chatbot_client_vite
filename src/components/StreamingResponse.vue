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
          <!-- <span class="cursor" :class="{ 'cursor-blink': isWaiting }">|</span> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
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
  content:{
    type: String,
    default: ""
  }
});

const displayedLines = ref([]);
const currentLineDisplay = ref('');
const isTyping = ref(false);
const isWaiting = ref(true);
const processingQueue = ref(false);

// Watch for new lines being added to streamedLines
watch(() => props.streamedLines, async (newLines) => {
  // If typing is disabled, do nothing (template will handle direct display)
  if (!props.enableTyping) return;
  
  // If already processing queue, don't start a new process
  if (processingQueue.value) return;
  
  try {
    processingQueue.value = true;
    
    while (displayedLines.value.length < newLines.length) {
      const nextLineIndex = displayedLines.value.length;
      const nextLine = newLines[nextLineIndex];
      
      isWaiting.value = false;
      isTyping.value = true;
      
      await typeCurrentLine(nextLine);
      
      displayedLines.value.push(nextLine);
      currentLineDisplay.value = '';
      
      isTyping.value = false;
      isWaiting.value = true;
    }
  } finally {
    processingQueue.value = false;
    emit('finishTyping');
  }
}, { deep: true });

const typeCurrentLine = async (line) => {
  currentLineDisplay.value = '';
  for (let i = 0; i < line.length; i++) {
    currentLineDisplay.value = line.slice(0, i + 1);
    await new Promise(resolve => setTimeout(resolve, props.typingSpeed));
  }
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

.cursor {
  display: inline-block;
  width: 2px;
  background-color: currentColor;
  margin-left: 1px;
  height: 1em;
  vertical-align: text-bottom;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>