import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_DEV_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        "ngrok-skip-browser-warning": true
    }
})

// axiosInstance.interceptors.request.use(
//     (config) => {
//         // No need to manually set JWT token as it will be automatically 
//         // included in requests due to withCredentials: true
//         return config
//     },
//     (error) => {
//         return Promise.reject(error)
//     }
// )

// // Response interceptor
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         // Handle different error status codes
//         if (error.response) {
//             switch (error.response.status) {
//                 case 401:
//                     // Unauthorized - could trigger refresh token logic here
//                     try {
//                         // Optional: Implement refresh token logic
//                         // await refreshToken()
//                         // Retry the original request
//                         // return axiosInstance(error.config)
//                     } catch (refreshError) {
//                         // Handle refresh token failure
//                         // Maybe redirect to login
//                     }
//                     break
//                 case 403:
//                     // Forbidden
//                     break
//                 case 404:
//                     // Not found
//                     break
//                 default:
//                     // Handle other errors
//                     break
//             }
//         }
//         return Promise.reject(error)
//     }
// )

export default axiosInstance

// Optional: Refresh token function
// const refreshToken = async () => {
//     try {
//         await axiosInstance.post('/auth/refresh')
//         // The server should set new cookies in the response
//         return true
//     } catch (error) {
//         throw error
//     }
// }