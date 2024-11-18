<template>
    <FileUpload v-if="a" />
    <ImageUpload v-if="!a"/>
</template>

<script>
import FileUpload from "@/components/FileUpload.vue"
import ImageUpload from "@/components/ImageUpload.vue"
export default{
    name: "TestView",
    components: {
        FileUpload,
        ImageUpload
    },
    setup() {
        const a = true
        return {a}
    }
}

</script>

<style scoped>
input{
    width: 50%;
    
}


</style>