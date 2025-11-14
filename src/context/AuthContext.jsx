// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react"
import axiosInstance from "@/services/axiosConfig"
import toast from "react-hot-toast"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      setLoadingUser(true)
      const { data } = await axiosInstance.get("/api/v1/auth/me")
      setUser(data)
    } catch (error) {
      setUser(null)
    } finally {
      setLoadingUser(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  const login = async ({ email, username, password }) => {
    try {
      const payload = { password }

      // permitimos login con email o username
      if (email) payload.email = email
      if (username) payload.username = username

      const { data } = await axiosInstance.post("/api/v1/auth/login", payload)
      setUser(data)
      toast.success("Sesión iniciada correctamente")
      return { ok: true }
    } catch (error) {
      const msg = error.response?.data?.error || "No se pudo iniciar sesión"
      toast.error(msg)
      return { ok: false, error: msg }
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post("/api/v1/auth/logout")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    loadingUser,
    login,
    logout,
    fetchMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
