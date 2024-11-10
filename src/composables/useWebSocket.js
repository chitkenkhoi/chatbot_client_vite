import { ref } from 'vue'
import { useChatStore } from '../store/index.js'

export function useWebSocket(chatId) {
    const ws = ref(null)
    const chatStore = useChatStore()

    const connectWebSocket = () => {
        const url = (import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_PROD_WS_URL : import.meta.env.VITE_DEV_WS_URL)+`/ws/${chatId}`
        ws.value = new WebSocket(url)
        ws.value.onopen = () => {
            chatStore.isConnected = true
        }

        ws.value.onmessage = (event) => {
            const message = event.data
            
            chatStore.streamToken(chatId, message)
        }

        ws.value.onclose = () => {
            chatStore.isConnected = false
        }
    }

    const disconnectWebSocket = () => {
        if (ws.value) {
            ws.value.close()
            ws.value = null
        }
    }

    return {
        connectWebSocket,
        disconnectWebSocket
    }
}