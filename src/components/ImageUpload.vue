// Frontend: ImageUpload.vue
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const selectedFile = ref(null)
const uploadStatus = ref('')
const isUploading = ref(false)

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadImage = async () => {
  if (!selectedFile.value) {
    uploadStatus.value = 'Please select a file first'
    return
  }

  try {
    isUploading.value = true
    
    // Step 1: Get preset URL from backend
    const presignResponse = await axios.get('/api/get-upload-preset', {
      params: {
        filename: selectedFile.value.name,
        fileType: selectedFile.value.type
      }
    })
    
    // Step 2: Prepare form data for Cloudinary
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('upload_preset', presignResponse.data.uploadPreset)
    // Add any additional parameters required by your Cloudinary preset
    
    // Step 3: Upload to Cloudinary
    const cloudinaryResponse = await axios.post(
      presignResponse.data.uploadUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    // Step 4: Notify backend about successful upload
    await axios.post('/api/image-uploaded', {
      imageUrl: cloudinaryResponse.data.secure_url,
      fileName: selectedFile.value.name,
      fileSize: selectedFile.value.size,
      fileType: selectedFile.value.type
    })

    uploadStatus.value = 'Upload successful!'
    selectedFile.value = null
  } catch (error) {
    console.error('Upload error:', error)
    uploadStatus.value = 'Upload failed: ' + error.message
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="upload-container">
    <input 
      type="file" 
      @change="handleFileSelect" 
      accept="image/*"
      :disabled="isUploading"
    >
    
    <button 
      @click="uploadImage" 
      :disabled="!selectedFile || isUploading"
    >
      {{ isUploading ? 'Uploading...' : 'Upload Image' }}
    </button>
    
    <p v-if="uploadStatus" :class="{ 'error': uploadStatus.includes('failed') }">
      {{ uploadStatus }}
    </p>
  </div>
</template>

<style scoped>
.upload-container {
  padding: 20px;
}

.error {
  color: red;
}
</style>