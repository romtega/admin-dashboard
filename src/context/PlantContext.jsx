import { createContext, useState, useEffect } from "react"
import axiosInstance from "@/services/axiosConfig"
import toast from "react-hot-toast"

const PlantContext = createContext()

const PlantProvider = ({ children }) => {
  const [plantsData, setPlantsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPlantsByPage = async (page = 1) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `/api/v1/plants?page=${page}&limit=8`
      )
      setPlantsData(response.data.plants)
      setTotalPages(response.data.totalPages)
      setCurrentPage(Number(response.data.currentPage))
    } catch (error) {
      console.error("Fetching plants failed", error)
      toast.error("No se pudo cargar la lista de especies")
    } finally {
      setLoading(false)
    }
  }

  const fetchAllPlants = () => fetchPlantsByPage(currentPage)

  useEffect(() => {
    fetchPlantsByPage(1)
  }, [])

  const contextValue = {
    plantsData,
    loading,
    currentPage,
    totalPages,
    fetchAllPlants,
    fetchPlantsByPage,
    setCurrentPage,
  }

  return (
    <PlantContext.Provider value={contextValue}>
      {children}
    </PlantContext.Provider>
  )
}

export { PlantContext, PlantProvider }
