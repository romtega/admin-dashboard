import { useContext } from "react"
import { PlantContext } from "@/context/PlantContext"

export function usePlantContext() {
  const context = useContext(PlantContext)

  if (!context) {
    throw new Error("usePlantContext must be used within a PlantProvider")
  }

  return context
}
