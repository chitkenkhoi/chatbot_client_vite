<template>
    <div>
        This is testview

    </div>
    <input v-model="data"/>
    <StreamingResponse
              :typingSpeed="50"
              :enableTyping="true"
              :content="'abc'"
              :streamedLines="realData"
            />
    <button class = "btn" @click = "handleClicked" > This is button</button>
</template>

<script>
import { ref } from "vue"
import StreamingResponse from "@/components/StreamingResponse.vue"
export default({
    name: "TestView",
    components: {
        StreamingResponse
    },
    setup() {
        const data = ref([])
        const realData = ref([])
        const handleClicked = () => {
            console.log("Button clicked")
            realData.value.push(data.value)
            data.value = ""
        }
        return {
            data,
            realData,
            handleClicked
        }
    }
})

</script>

<style scoped>
input{
    width: 50%;
    
}


</style>