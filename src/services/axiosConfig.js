import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

// You can add interceptors if needed
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Modify request config before sending the request
//     return config
//   },
//   (error) => {
//     // Handle request error
//     return Promise.reject(error)
//   }
// )

// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Modify response data before returning it
//     return response
//   },
//   (error) => {
//     // Handle response error
//     return Promise.reject(error)
//   }
// )

export default axiosInstance
