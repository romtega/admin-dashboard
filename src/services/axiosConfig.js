import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    Accept: "application/json", // opcional
    // No fijes Content-Type aquí
  },
})

// Si el body es FormData, deja que el navegador ponga multipart/form-data con boundary.
// Si no es FormData, usa application/json.
axiosInstance.interceptors.request.use(config => {
  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData

  if (isFormData) {
    if (config.headers && "Content-Type" in config.headers) {
      delete config.headers["Content-Type"]
    }
  } else {
    if (config.headers && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json"
    }
  }
  return config
})

export default axiosInstance
