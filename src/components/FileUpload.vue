<!-- FileUpload.vue -->
<template>
  <div
    class="file-upload-container"
    tabindex="0"
    @paste="handlePaste"
    @dragover.prevent
    @drop.prevent="handleDrop"
    :class="{ dragging: isDragging }"
  >
    <div class="upload-area">
      <div v-if="!selectedFile" class="upload-prompt">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept="image/*"
          class="hidden-input"
        />
        <button @click="triggerFileInput" class="upload-button">
          Chọn ảnh
        </button>
        <p>hoặc kéo và thả ảnh tại đây</p>
        <p class="paste-hint">Bạn có thể dán (Ctrl+V) vào đây</p>
      </div>

      <div v-else class="preview-area">
        <img :src="previewUrl" alt="Preview" class="image-preview" />
        <div class="file-info">
          <p class="filename">{{ selectedFile.name || "Pasted image" }}</p>
          <button
            @click="uploadFile"
            :disabled="isUploading"
            class="upload-button"
          >
            {{ isUploading ? "Đang tải..." : "Xác nhận" }}
          </button>
          <button
            @click="clearSelection"
            class="clear-button"
            :disabled="isUploading"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>

    <div v-if="uploadStatus" :class="['status-message', uploadStatus.type]">
      {{ uploadStatus.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { PinataSDK } from "pinata-web3";
import axiosInstance from "@/api/axios.js";
import { useChatStore } from "../store";
import { useRoute } from "vue-router";
const emit = defineEmits(["file-uploaded"]);
const chatStore = useChatStore();
const fileInput = ref(null);
const selectedFile = ref(null);
const previewUrl = ref("");
const isDragging = ref(false);
const isUploading = ref(false);
const uploadStatus = ref(null);
const route = useRoute();
// Accepted file types
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const triggerFileInput = () => {
  fileInput.value.click();
};

const validateFile = (file) => {
  if (!file) return false;
  if (!ACCEPTED_TYPES.includes(file.type)) {
    uploadStatus.value = {
      type: "error",
      message: "Vui lòng chọn file ảnh đúng định dạng (JPEG, PNG, GIF, WEBP)",
    };
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    uploadStatus.value = {
      type: "error",
      message: "Kích thước ảnh không được vượt quá 5MB",
    };
    return false;
  }
  uploadStatus.value = null;
  return true;
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (validateFile(file)) {
    selectedFile.value = file;
    createPreview(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (validateFile(file)) {
    selectedFile.value = file;
    createPreview(file);
  }
};

const handlePaste = async (event) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData)
    .items;

  for (const item of items) {
    if (item.type.indexOf("image") === 0) {
      const file = item.getAsFile();

      if (validateFile(file)) {
        // Create a named file from the blob
        const namedFile = new File([file], "pasted-image.png", {
          type: file.type,
          lastModified: new Date().getTime(),
        });

        selectedFile.value = namedFile;
        createPreview(namedFile);
        break;
      }
    }
  }
};

const createPreview = (file) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  previewUrl.value = URL.createObjectURL(file);
};

const clearSelection = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  selectedFile.value = null;
  previewUrl.value = "";
  uploadStatus.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadStatus.value = null;

  try {
    const response1 = await axiosInstance.get("/api/get-signed-jwt");
    const signedJwt = response1.data.jwt;
    const pinata = new PinataSDK({
      pinataJwt: signedJwt,
      pinataGateway: "https://magenta-known-swan-641.mypinata.cloud",
    });
    const upload = await pinata.upload.file(selectedFile.value);
    if (route.name === "new") {
      chatStore.setFile("new", selectedFile.value, upload.IpfsHash);
    } else {
      chatStore.setFile(route.params.id, selectedFile.value, upload.IpfsHash);
    }
    isUploading.value = false;
    // const response = await fetch('http://localhost:8080/upload', {
    //   method: 'POST',
    //   body: formData,
    // })

    // if (!response.ok) {
    //   throw new Error('Upload failed')
    // }

    // const result = await response.json()
    emit("file-uploaded");
  } catch (error) {
    uploadStatus.value = {
      type: "error",
      message: "Failed to upload file: " + error.message,
    };
  } finally {
    isUploading.value = false;
  }
};

// Clean up object URLs when component is unmounted
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
defineExpose({
  isUploading,
});
</script>

<style scoped>
.file-upload-container {
  font-family: "Baloo Paaji 2", sans-serif;
  /* font-weight: 400; */
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  outline: none; /* Removes the focus outline */
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  transition: all 0.3s ease;
  /* height:90%; */
  max-height: 98%;
}

.upload-area.dragging {
  border-color: #bc8f8f;
  background-color: rgba(33, 150, 243, 0.1);
}

.hidden-input {
  display: none;
}

.upload-button {
  background-color: #bc8f8f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 400;
  width: 100px;
}

.upload-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.clear-button {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 400;
  width: 100px;
}
.clear-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.preview-area {
  margin-top: 20px;
}

.image-preview {
  max-width: 100%;
  max-height: 300px;
  margin-bottom: 10px;
}

.status-message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
}

.status-message.error {
  background-color: #ffebee;
  color: #c62828;
}

.status-message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.paste-hint {
  color: #666;
  font-size: 0.9em;
  margin-top: 10px;
}
.filename {
  max-width: 100%;
}
</style>