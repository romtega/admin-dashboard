// src/context/PlantContext.jsx
import { createContext, useState, useEffect, useRef, useCallback } from "react"
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

  // Guardamos el AbortController del request en curso
  const abortRef = useRef(null)

  const fetchPlantsByPage = useCallback(
    async (page = 1, search = "") => {
      // Si hay un request en curso, lo cancelamos
      if (abortRef.current) {
        abortRef.current.abort()
      }
      const controller = new AbortController()
      abortRef.current = controller

      setLoading(true)
      try {
        const encoded = encodeURIComponent(search || "")
        const response = await axiosInstance.get(
          `/api/v1/plants?page=${page}&limit=8&search=${encoded}`,
          { signal: controller.signal }
        )

        setPlantsData(response.data.plants)
        setTotalPlants(response.data.totalPlants)
        setTotalEstablished(response.data.totalEstablished)
        setTotalNursery(response.data.totalNursery)
        setTotalPages(response.data.totalPages)
        setCurrentPage(Number(response.data.currentPage))
      } catch (error) {
        // Si fue canceción, no mostramos error
        const wasCanceled =
          error?.name === "CanceledError" || error?.code === "ERR_CANCELED"
        if (!wasCanceled) {
          console.error("Fetching plants failed", error)
          toast.error("No se pudo cargar la lista de especies")
        }
      } finally {
        // Limpiamos el controller solo si es el activo
        if (abortRef.current === controller) {
          abortRef.current = null
          setLoading(false)
        }
      }
    },
    [] // estable; no depende de estado
  )

  // Helper que usa la página actual (si necesitas llamarlo desde fuera)
  const fetchAllPlants = useCallback(
    () => fetchPlantsByPage(currentPage),
    [fetchPlantsByPage, currentPage]
  )

  useEffect(() => {
    fetchPlantsByPage(1)
    // cancelamos si el componente se desmonta durante una petición
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [fetchPlantsByPage])

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
