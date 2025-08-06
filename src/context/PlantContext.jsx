import { createContext, useState, useEffect } from "react"
import axiosInstance from "@/services/axiosConfig"
import toast from "react-hot-toast"

const PlantContext = createContext()

const PlantProvider = ({ children }) => {
  const [plantsData, setPlantsData] = useState([])
  const [totalPlants, setTotalPlants] = useState(0)
  const [totalEstablished, setTotalEstablished] = useState(0)
  const [totalNursery, setTotalNursery] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPlantsByPage = async (page = 1, search = "") => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `/api/v1/plants?page=${page}&limit=8&search=${search}`
      )
      setPlantsData(response.data.plants)
      setTotalPlants(response.data.totalPlants)
      setTotalEstablished(response.data.totalEstablished)
      setTotalNursery(response.data.totalNursery)
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
    totalPlants,
    totalEstablished,
    totalNursery,
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
