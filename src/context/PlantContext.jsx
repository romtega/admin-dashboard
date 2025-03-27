// src/context/PlantContext.jsx
import { createContext, useState, useEffect } from "react"
import axiosInstance from "@/services/axiosConfig"

const PlantContext = createContext()

function PlantProvider({ children }) {
  const [plantsData, setPlantsData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllPlants = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/plants")
      setPlantsData(response.data?.plants || [])
    } catch (error) {
      console.error("Fetching plants failed", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPlants()
  }, [])

  const contextValue = {
    plantsData,
    setPlantsData,
    fetchAllPlants,
    loading,
  }

  return (
    <PlantContext.Provider value={contextValue}>
      {children}
    </PlantContext.Provider>
  )
}

export { PlantContext, PlantProvider }
